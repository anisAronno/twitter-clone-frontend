<template>
  <div
    class="grid min-h-screen max-h-full place-items-center dark:bg-gray-900 mt-2"
  >
    <div class="card max-w-md">
      <div class="w-full grid h-full place-items-center">
        <User class="avatar p-3 w-32"></User>
      </div>
      <form class="space-y-6 mt-5" @submit.prevent="register">
        <h5 class="heading">Create a new Account</h5>
        <div>
          <label for="email" class="label">Your Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            class="form-controll"
            :class="{ 'border-red': err?.name }"
            placeholder="name@company.com"
            v-model="signupForm.name"
          />
          <div class="error" v-if="err?.name">
            <p v-for="(err, i) in err.name" :key="i">
              {{ err }}
            </p>
          </div>
        </div>
        <div>
          <label for="email" class="label">Your email:</label>
          <input
            type="email"
            name="email"
            id="email"
            class="form-controll"
            :class="{ 'border-red': err?.email }"
            placeholder="name@company.com"
            v-model="signupForm.email"
          />
          <div class="error" v-if="err?.email">
            <p v-for="(err, i) in err.email" :key="i">
              {{ err }}
            </p>
          </div>
        </div>
        <div>
          <label for="email" class="label">Your username:</label>
          <input
            type="text"
            name="username"
            id="username"
            class="form-controll"
            :class="{ 'border-red': err?.username }"
            placeholder="name@company.com"
            v-model="signupForm.username"
          />
          <div class="error" v-if="err?.username">
            <p v-for="(err, i) in err.username" :key="i">
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
            v-model="signupForm.password"
            :class="{ 'border-red': err?.password }"
          />
          <div class="error" v-if="err?.password">
            <p v-for="(err, i) in err.password" :key="i">
              {{ err }}
            </p>
          </div>
        </div>

        <div>
          <label for="confirm_password" class="dark:text-white text-gray-900"
            >Confirm Password</label
          >
          <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            v-model="signupForm.password_confirmation"
            placeholder="••••••••"
            class="form-controll"
            :class="{ 'border-red': err?.password_confirmation }"
          />
          <div class="error" v-if="err?.password_confirmation">
            <p
              v-for="(err, i) in err.password_confirmation"
              :key="i"
              class="break-all"
            >
              {{ err }}
            </p>
          </div>
        </div>

        <button type="submit" class="btn btn-primary">
          <span v-if="!isSaved">Create account</span>
          <ButtonSpiner v-else>Processing... </ButtonSpiner>
        </button>
        <div>
          <span class="inline-block mr-2 dark:text-white text-gray-900"
            >Have a account?</span
          >
          <router-link :to="{ name: 'login' }" class="login-link !text-lg"
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
import { signupRules } from "@/validation/rules/signupRules";
import parseError from "../helper/parseError";

export default {
  components: {
    User,
    ButtonSpiner,
  },
  data() {
    return {
      isSaved: false,
      signupForm: {
        name: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
      },
      err: {},
    };
  },

  methods: {
    async register() {
      let v$ = useVuelidate(signupRules, this.signupForm);
      let isValidate = await v$.value.$validate();

      if (!isValidate) {
        this.isSaved = false;
        this.err = parseError(v$);
        return;
      }

      this.$http
        .post(this.$api("/register"), this.signupForm)
        .then((response) => {
          if (response.data.access_token) {
            this.isSaved = true;

            this.$store.dispatch("login", response.data);
            this.$http.defaults.headers.common["Authorization"] =
              "Bearer " + response.data.access_token;

            this.$notification(
              "Account Created successfully.",
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
