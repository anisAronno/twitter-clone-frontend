<template>
  <div class="grid min-h-screen max-h-full place-items-center dark:bg-gray-900">
    <div class="card max-w-md">
      <div class="w-full grid h-full place-items-center">
        <User class="avatar p-3 w-32"></User>
      </div>
      <form class="space-y-6 mt-5" @submit.prevent="login">
        <h5 class="heading">Login to Your Account</h5>
        <div>
          <label for="email" class="label">Your email:</label>
          <input
            type="text"
            name="email"
            id="email"
            class="form-controll"
            :class="{ 'border-red': err?.email }"
            placeholder="name@company.com"
            v-model="loginForm.email"
          />
          <div class="error" v-if="err?.email">
            <p v-for="(err, i) in err.email" :key="i">
              {{ err }}
            </p>
          </div>
        </div>
        <div>
          <label for="password" class="label">Your password: </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            class="form-controll"
            v-model="loginForm.password"
            :class="{ 'border-red': err?.password }"
          />
          <div class="error" v-if="err?.password">
            <p v-for="(err, i) in err.password" :key="i">
              {{ err }}
            </p>
          </div>
        </div>
        <div class="flex items-start">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                class="form-controll"
              />
            </div>
            <label
              for="remember"
              class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Remember me</label
            >
          </div>
          <router-link :to="{ name: 'passwordRecover' }" class="login-link"
            >Lost Password?</router-link
          >
        </div>
        <button type="submit" class="btn btn-primary">
          <span v-if="!isSaved">Login to your account</span>
          <ButtonSpiner v-else>Processing... </ButtonSpiner>
        </button>
        <div>
          <span class="inline-block mr-2 dark:text-white text-gray-900"
            >Need an account?</span
          >
          <router-link :to="{ name: 'signup' }" class="login-link !text-lg"
            >Signup</router-link
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
import { loginRules } from "@/validation/rules/loginRules";
import parseError from "../helper/parseError";

export default {
  components: {
    User,
    ButtonSpiner,
  },
  data() {
    return {
      isSaved: false,
      loginForm: {
        email: "",
        password: "",
      },
      err: {},
    };
  },

  methods: {
    async login() {
      let v$ = useVuelidate(loginRules, this.loginForm);
      let isValidate = await v$.value.$validate();

      if (!isValidate) {
        this.isSaved = false;
        this.err = parseError(v$);
        return;
      }

      this.$http
        .post(this.$api("api/login"), this.loginForm)
        .then((response) => {
          if (response.data.access_token) {
            this.isSaved = true;

            this.$store.dispatch("login", response.data);
            this.$http.defaults.headers.common["Authorization"] =
              "Bearer " + response.data.access_token;

            this.$notification("Login successful.", response.data.success);
            if (
              this.$route.query.redirect &&
              this.$route.query.redirect != "/logout"
            ) {
              this.$router.push({ path: this.$route.query.redirect });
            } else {
              this.$router.push({ path: "/" });
            }
          } else {
            this.$notification(response.data.message, response.data.success);
          }
        })
        .catch((error) => {
          this.err = error?.response?.data?.errors
            ? error?.response?.data?.errors
            : [];
          console.log(error?.response?.data);
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
