<template>
  <div class="flex justify-between items-center gap-3 h-8">
    <div class="logo flex-auto">
      <router-link :to="{ name: 'home' }">
        <img class="w-20 h-20" src="@/assets/logo.png" alt="Logo" />
      </router-link>
    </div>
    <div class="flex-none">
      <DarkMode></DarkMode>
    </div>
    <div v-if="user" class="flex-none">
      <div
        class="cursor-pointer relative duration-500 hover:scale-105"
        @click="isToggleOpen = !isToggleOpen"
      >
        <img
          v-if="user.image"
          :src="user.image"
          alt="Logo"
          class="w-8 h-8 rounded-full ring-1 ring-[#7CA2FF] ring-offset-2"
        />
        <User
          v-else
          class="avatar w-8 h-8 rounded-full ring-1 ring-[#7CA2FF] ring-offset-2"
        ></User>
      </div>
      <div :class="{ hidden: !isToggleOpen }" class="relative">
        <ul
          class="absolute right-0 top-30 w-24 text-right space-y-2 pt-3 dark:bg-gray-800 dark:text-white p-2 mt-2"
        >
          <li class="duration-500 hover:scale-105">
            <router-link :to="{ name: 'profile' }">Account</router-link>
          </li>
          <li
            @click.prevent="logout"
            class="cursor-pointer text-red-500 duration-500 hover:scale-105"
          >
            Logout
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import DarkMode from "./DarkMode.vue";
import User from "./User.vue";

export default {
  components: {
    DarkMode,
    User,
  },
  data() {
    return {
      isLoggedIn: !!localStorage.getItem("access_token"),
      isToggleOpen: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    logout() {
      this.$http
        .post(this.$api("api/logout"), this.loginForm)
        .then((response) => {
          this.$store.dispatch("logout");
          this.$notification("Logout successful.", response.data.success);
          this.$router.push("/login");
        })
        .catch((error) => {
          this.$notification(error?.message ?? "Something went wrong!!");
        });
    },
  },
};
</script>
