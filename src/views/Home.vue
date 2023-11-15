<template>
  <div>
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
        <button type="submit" class="btn-primary flex-auto h-10 !w-32">
          Tweet
        </button>
      </form>
    </div>
    <div class="!w-full">
      <Tweets />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Tweets from "@/components/Tweets.vue";
export default {
  components: {
    Header,
    Tweets,
  },
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

<style scoped>
.down::after {
  content: "\2304";
  float: right;
  font-size: 20px;
  font-weight: 500;
}
.up::after {
  content: "\2303";
  float: right;
  font-size: 20px;
  font-weight: 500;
}
</style>
