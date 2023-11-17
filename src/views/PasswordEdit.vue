<template>
  <div
    class="grid place-items-center pt-10 text-gray-900 bg-white dark:text-white dark:bg-gray-900"
    v-if="user.id"
  >
    <div class="card max-w-2xl relative">
      <div class="absolute right-1 top-0 text-dark dark:text-white">
        <span @click="$emit('back')" class="back-btn">&#8592;</span>
      </div>
      <h2 class="heading">
        <span class="mr-2">Reset Password </span>
      </h2>
      <div class="pt-5">
        <form @submit.prevent="passwordUpdate" class="overflow-hidden">
          <table class="table-auto min-w-full">
            <tbody>
              <tr class="border-y">
                <td class="profile-edit-label">Old Password:</td>
                <td class="profile-edit-label">
                  <input
                    type="password"
                    name="old_password"
                    id="old_password"
                    v-model="passwordForm.old_password"
                    :class="{ 'border-red': err.old_password }"
                    class="form-controll"
                  />
                  <div class="error" v-if="err.old_password">
                    <p v-for="(err, i) in err.old_password" :key="i">
                      {{ err }}
                    </p>
                  </div>
                </td>
              </tr>
              <tr class="border-b">
                <td class="profile-edit-label">New Password:</td>
                <td class="profile-edit-label">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    v-model="passwordForm.password"
                    :class="{ 'border-red': err.password }"
                    class="form-controll"
                  />
                  <div class="error" v-if="err.password">
                    <p v-for="(err, i) in err.password" :key="i">
                      {{ err }}
                    </p>
                  </div>
                </td>
              </tr>
              <tr class="border-b">
                <td class="profile-edit-label">Confirm Password:</td>
                <td class="profile-edit-label">
                  <input
                    type="password"
                    name="password_confirmation"
                    id="password_confirmation"
                    v-model="passwordForm.password_confirmation"
                    :class="{ 'border-red': err.password_confirmation }"
                    class="form-controll"
                  />
                  <div class="error" v-if="err.password_confirmation">
                    <p v-for="(err, i) in err.password_confirmation" :key="i">
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
                    <span v-if="!isSaved">Update Password</span>
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
import useVuelidate from "@vuelidate/core";
import { passwordUpdateRules } from "@/validation/rules/passwordUpdateRules";
import parseError from "../helper/parseError";

export default {
  data() {
    return {
      isSaved: false,
      passwordForm: {
        id: this.user?.id,
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
        this.passwordForm = {
          id: newVal?.id,
          old_password: "",
          password: "",
          password_confirmation: "",
        };
      },
      immediate: true,
    },
  },
  methods: {
    async passwordUpdate() {
      let v$ = useVuelidate(passwordUpdateRules, this.passwordForm);
      let isValidate = await v$.value.$validate();

      if (!isValidate) {
        this.isSaved = false;
        this.err = parseError(v$);
        return;
      }

      this.$http
        .post(
          this.$api(`/password-update/${this.passwordForm.id}`),
          this.passwordForm
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
          this.err = error?.response?.data?.errors
            ? error?.response?.data?.errors
            : [];
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
