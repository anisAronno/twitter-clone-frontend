<template>
  <div
    class="!min-w-full flex flex-wrap justify-between items-center gap-2 md:gap-5 max-h-fit md:h-20 bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white fixed top-0 w-full z-50 shadow-sm"
  >
    <div class="logo md:flex-auto p-2 order-1 flex-auto">
      <router-link :to="{ name: 'home' }">
        <img class="w-12 h-12" src="@/assets/logo.png" alt="Logo" />
      </router-link>
    </div>

    <div class="order-last md:order-2 flex-grow my-2 my:0">
      <TweetForm v-if="$route.name == 'home' || $route.name === 'profile'" />
    </div>

    <div class="order-2 md:order-3 flex-auto">
      <div class="w-32 sm:w-40 md:w-60" v-if="$route.name == 'home'">
        <Search />
      </div>
    </div>
    <div
      class="flex order-3 md:order-4 gap-2 md:gap-5 pr-3 justify-end item z-40"
      :class="{
        '-mr-20 sm:mr-0': $route.name != 'home',
        '-mr-0 sm:mr-0 !order-last md:order-4': $route.name === 'profile',
      }"
    >
      <DarkMode></DarkMode>
      <div v-if="$store.getters.isAuthenticated">
        <div
          class="cursor-pointer relative duration-500 hover:scale-105"
          @click="toggleDropdown"
        >
          <img
            v-if="user?.image"
            :src="user?.image"
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
            class="absolute right-0 top-30 w-36 text-right space-y-2 pt-3 bg-gray-600 dark:bg-gray-800 text-white p-2 mt-2"
          >
            <li class="cursor-pointer duration-500 hover:scale-105">
              <router-link :to="{ name: 'profile' }">Account</router-link>
            </li>
            <li class="cursor-pointer duration-500 hover:scale-105">
              <router-link :to="{ name: 'passwordEdit' }"
                >Reset Password</router-link
              >
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
  </div>
</template>

<script>
import DarkMode from "./DarkMode.vue";
import User from "./User.vue";
import Search from "./Search.vue";
import TweetForm from "./TweetForm.vue";

export default {
  components: {
    DarkMode,
    User,
    Search,
    TweetForm,
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
        .post(this.$api("/logout"), this.loginForm)
        .then((response) => {
          this.$store.dispatch("logout");
          this.$notification("Logout successful.", response.data.success);
          this.$router.push("/login");
        })
        .catch((error) => {
          this.$notification(error?.message ?? "Something went wrong!!");
        });
    },
    toggleDropdown() {
      this.isToggleOpen = !this.isToggleOpen;

      if (this.isToggleOpen) {
        document.addEventListener("click", this.closeDropdown);
      } else {
        document.removeEventListener("click", this.closeDropdown);
      }
    },
    closeDropdown(event) {
      const dropdown = this.$el.querySelector(".cursor-pointer");
      if (!dropdown.contains(event.target)) {
        this.isToggleOpen = false;
        document.removeEventListener("click", this.closeDropdown);
      }
    },
  },
};
</script>
