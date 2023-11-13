<template>
  <div class="grid h-screen place-items-center dark:bg-gray-900">
    <div class="card max-w-sm">
      <div class="w-full grid h-full place-items-center">
        <User class="avatar p-3 w-32"></User>
      </div>
      <form class="space-y-6 pt-5" @submit.prevent="submitForm">
        <h5 class="heading">Recover Your Password</h5>
        <div>
          <label for="email" class="label">Your email</label>
          <input
            type="email"
            name="email"
            id="email"
            class="form-controll"
            placeholder="name@company.com"
            v-model="forgetPasswordForm.email"
            :class="{ '!border-2 !border-rose-500': err?.email }"
          />
          <div class="text-red-500" v-if="err?.email">
            <p v-for="(err, i) in err.email" :key="i">
              {{ err }}
            </p>
          </div>
        </div>

        <button type="submit" class="btn btn-primary">
          <span v-if="!isSaved">Submit</span>
          <ButtonSpiner v-else>Processing... </ButtonSpiner>
        </button>

        <div class="flex items-start">
          <router-link :to="{ name: 'login' }" class="login-link"
            >Login</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import ButtonSpiner from "@/components/ButtonSpiner.vue";
import User from "@/components/User.vue";
import useVuelidate from "@vuelidate/core";
import { forgetPasswordRules } from "@/validation/rules/forgetPasswordRules";
import parseError from "../helper/parseError";

export default {
  components: {
    User,
    ButtonSpiner,
  },
  data() {
    return {
      isSaved: false,
      forgetPasswordForm: {
        email: "",
      },
      err: {},
    };
  },

  methods: {
    async submitForm() {
      let v$ = useVuelidate(forgetPasswordRules, this.forgetPasswordForm);
      let isValidate = await v$.value.$validate();

      if (!isValidate) {
        this.isSaved = false;
        this.err = parseError(v$);
        return;
      }

      this.$http
        .post(this.$api("api/password-recover"), this.forgetPasswordForm)
        .then((response) => {
          if (response.data.access_token) {
            this.isSaved = true;

            this.$store.dispatch("login", response.data);
            this.$http.defaults.headers.common["Authorization"] =
              "Bearer " + response.data.access_token;

            this.$notification(
              "Email send. Please check your mailbox",
              response.data.success
            );

            this.$router.push({ path: "/" });
          } else {
            this.$notification(response.data.message, response.data.success);
          }
        })
        .catch((error) => {
          this.err = error?.response?.data?.errors
            ? error?.response?.data?.errors
            : [];
          this.$notification(
            error?.response?.data?.errors
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
