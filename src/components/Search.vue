<template>
  <form @submit.prevent="searchSubmit">
    <label
      for="default-search"
      class="text-sm font-medium text-gray-900 sr-only dark:text-white"
      >Search</label
    >
    <div class="relative">
      <div
        class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
      >
        <svg
          class="w-3 h-3 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        id="default-search"
        class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search by username"
        v-model="username"
        required
      />
      <button
        type="submit"
        class="text-white absolute end-2.5 bottom-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <svg
          class="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: "",
    };
  },
  computed: {
    searchingUserName() {
      return this.$store.getters.searchingUserName;
    },
  },
  watch: {
    searchingUserName(newValue, oldValue) {
      if (newValue?.length == 0) {
        this.username = "";
        this.$store.dispatch("searchingUserName", this.username);
      }
    },
    username(newValue, oldValue) {
      if (newValue?.length == 0) {
        this.username = "";
        this.$store.dispatch("searchingUserName", this.username);
      }
    },
  },
  methods: {
    searchSubmit() {
      this.$store.dispatch("searchingUserName", this.username);
    },
  },
};
</script>

<style></style>
