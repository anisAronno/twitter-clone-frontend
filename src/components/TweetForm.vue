<template>
  <div class="grid place-items-center">
    <form @submit.prevent="submitTweet">
      <input
        type="text"
        readonly
        class="form-controll w-[400px] md:w-[300px] xl:w-[500px] !rounded-xl"
        @click="showModal = true"
        placeholder="Post Tweet"
      />
      <Modal v-if="showModal" @close="closeModal" :title="modalTitle">
        <template v-slot:body>
          <textarea
            name="content"
            id="content"
            cols="30"
            rows="3"
            class="form-controll flex-none"
            v-model="content"
            required
          ></textarea>
        </template>
        <template v-slot:footer>
          <button
            type="button"
            class="mr-3 text-gray-100 bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white focus:z-10 dark:bg-red-600 dark:text-gray-100 dark:border-gray-500 dark:hover:text-white dark:focus:ring-gray-600"
            @click="closeModal"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </template>
      </Modal>
    </form>
  </div>
</template>

<script>
import Modal from "./Modal.vue";
export default {
  data() {
    return {
      content: "",
      showModal: false,
      modalTitle: "Add Tweet",
    };
  },
  components: {
    Modal,
  },
  methods: {
    submitTweet() {
      if (!this.content || this.content.trim().length === 0) {
        this.$notification("Tweet content cannot be empty.", "error");
        return;
      }
      this.$http
        .post(this.$api("/tweet"), { content: this.content })
        .then((res) => {
          if (res.status == 201) {
            this.content = "";
            let userData = this.user;
            userData.tweets_count = Number(userData.tweets_count) + 1;
            this.$store.dispatch("updateUser", { data: userData });
            this.$notification(res.data.message, res.data.success);
          } else {
            this.$notification(res.data.message, res.data.success);
          }
          this.closeModal();
        })
        .catch((err) => {
          this.$notification(err.message, "error");
        });
    },
    closeModal() {
      this.showModal = false;
    },
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>

<style>
/* Your styles here */
</style>
