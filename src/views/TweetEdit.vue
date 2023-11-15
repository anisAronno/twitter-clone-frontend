<template>
  <div
    class="grid place-items-center pt-10 text-gray-900 bg-white dark:text-white dark:bg-gray-900"
    v-if="tweet.id"
  >
    <div class="card max-w-2xl w-full relative">
      <div class="absolute right-1 top-0 text-dark dark:text-white">
        <span @click="$emit('back')" class="back-btn">&#8592;</span>
      </div>
      <h2 class="heading">
        <span class="mr-2">Edit Tweet </span>
      </h2>
      <div class="pt-5">
        <form @submit.prevent="tweetSubmit" class="overflow-hidden">
          <table class="table-auto min-w-full">
            <tbody>
              <tr class="border-y">
                <td class="profile-edit-label">
                  <textarea
                    name="name"
                    id="name"
                    v-model="tweet.content"
                    :class="{ 'border-red': err.name }"
                    class="form-controll"
                    cols="30"
                    rows="5"
                  ></textarea>
                  <div class="error" v-if="err.name">
                    <p v-for="(err, i) in err.name" :key="i">
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
                    <span v-if="!isLoading">Update Tweet</span>
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
      isLoading: false,
      tweet: {
        id: "",
        content: "",
      },
      err: {},
    };
  },

  mounted() {
    this.fetchTweet();
  },
  methods: {
    fetchTweet() {
      this.isLoading = false;
      this.$http
        .get(this.$api(`api/tweet/${this.$route.params.id}`))
        .then((response) => {
          if (response.data) {
            this.tweet = response.data.data;
            this.isLoading = true;
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
          this.isLoading = false;
        });
    },
    tweetSubmit() {
      this.$http
        .put(this.$api(`api/tweet/${this.tweet.id}`), this.tweet)
        .then((response) => {
          if (response.data) {
            this.isLoading = true;
            this.$router.push({ name: "profile" });
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
          this.isLoading = false;
        });
    },
  },
};
</script>
