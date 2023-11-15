<template>
  <div
    class="flex justify-between items-center gap-3 h-20 bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white"
  >
    <div class="logo flex-none p-2">
      <router-link :to="{ name: 'home' }">
        <img class="w-12 h-12" src="@/assets/logo.png" alt="Logo" />
      </router-link>
    </div>
    <div
      aria-label="searchbox flex-auto  "
      v-if="$store.getters.isAuthenticated"
    >
      <div class="md:w-96" v-if="$route.name == 'home'"><Search /></div>
    </div>
    <div class="flex flex-none gap-5 pr-3">
      <DarkMode></DarkMode>
      <div v-if="$store.getters.isAuthenticated">
        <div
          class="cursor-pointer relative duration-500 hover:scale-105"
          @click="toggleDropdown"
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

export default {
  components: {
    DarkMode,
    User,
    Search,
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
