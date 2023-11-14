<template>
  <div class="grid place-items-center pt-5 dark:text-white" v-if="user.id">
    <div class="card max-w-2xl relative">
      <div class="absolute right-1 top-0 text-dark dark:text-white">
        <span @click="$emit('back')" class="back-btn">&#8592;</span>
      </div>
      <h2 class="heading">
        <span class="mr-2">Edit Account Information </span>
      </h2>
      <div class="pt-5">
        <form @submit.prevent="profileSubmit" class="overflow-hidden">
          <table class="table-auto min-w-full">
            <tbody>
              <tr class="border-y">
                <td class="profile-edit-label">Name</td>
                <td class="profile-edit-label">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    v-model="userData.name"
                    :class="{ 'border-red': err.name }"
                    class="form-controll"
                  />
                  <div class="error" v-if="err.name">
                    <p v-for="(err, i) in err.name" :key="i">
                      {{ err }}
                    </p>
                  </div>
                </td>
              </tr>
              <tr class="border-b">
                <td class="profile-edit-label">Email</td>
                <td class="profile-edit-label">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    :value="userData.email"
                    :class="{ 'border-red': err.email }"
                    class="form-controll"
                  />
                </td>
              </tr>
              <tr class="border-b">
                <td class="profile-edit-label">User Name</td>
                <td class="profile-edit-label">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    v-model="userData.username"
                    :class="{ 'border-red': err.username }"
                    class="form-controll"
                  />
                  <div class="error" v-if="err.username">
                    <p v-for="(err, i) in err.username" :key="i">
                      {{ err }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="profile-edit-label !pb-0 !pt-5" colspan="2">
                  <button type="submit" class="btn btn-primary">
                    <span v-if="!isSaved">Update Profile</span>
                    <ButtonSpiner v-else>Processing... </ButtonSpiner>
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import ImageLoader from "@/components/ImageLoader.vue";

export default {
  components: {
    Header,
    ImageLoader,
  },

  data() {
    return {
      isSaved: false,
      userData: {
        id: this.user?.id,
        name: this.user?.name,
        email: this.user?.email,
        username: this.user?.username,
      },
      err: {},
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  watch: {
    user: {
      handler(newVal) {
        this.userData = {
          id: newVal?.id,
          name: newVal?.name,
          email: newVal?.email,
          username: newVal?.username,
        };
      },
      immediate: true,
    },
  },
  methods: {
    profileSubmit() {
      this.$http
        .post(
          this.$api(`api/profile-update/${this.userData.id}`),
          this.userData
        )
        .then((response) => {
          if (response.data) {
            this.$store.dispatch("updateUser", response.data);
            this.$notification("Updated successful.", response.data.success);
            this.isSaved = true;
            this.$router.push({ path: "/profile" });
          } else {
            this.$notification(response.data.message, response.data.success);
          }
        })
        .catch((error) => {
          this.$notification(
            error?.response?.data
              ? error?.response?.data?.message
              : error?.message ?? "The given data was invalid!"
          );
        })
        .finally(() => {
          this.isSaved = false;
        });
    },
  },
};
</script>
