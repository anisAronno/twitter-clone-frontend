<template>
  <div class="grid place-items-center">
    <form
      @submit.prevent="submitTweet"
      class="flex flex-col md:flex-row gap-5 items-center mx-auto"
    >
      <textarea
        name="content"
        id="content"
        cols="30"
        rows="2"
        class="form-controll flex-none"
        v-model="content"
      ></textarea>
      <button type="submit" class="btn-primary flex-auto h-10 !w-32 z-50">
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

  methods: {
    submitTweet() {
      this.$http
        .post(this.$api("api/tweet"), { content: this.content })
        .then((res) => {
          if (res.data.success) {
            this.content = "";
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
