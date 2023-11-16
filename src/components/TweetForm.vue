<template>
  <div class="grid place-items-center sm:max-w-min lg:max-w-max">
    <form
      @submit.prevent="submitTweet"
      class="flex flex-col md:flex-row gap-5 items-center mx-auto"
    >
      <textarea
        name="content"
        id="content"
        cols="30"
        rows="1"
        class="form-controll flex-none"
        v-model="content"
        required
      ></textarea>
      <button
        type="submit"
        class="btn-primary flex-auto h-8 flex items-center !w-20 !md:w-32 z-50"
      >
        Tweet
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    submitTweet() {
      this.$http
        .post(this.$api("api/tweet"), { content: this.content })
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
        })
        .catch((err) => {
          this.$notification(err.message, "error");
        });
    },
  },
};
</script>

<style></style>
