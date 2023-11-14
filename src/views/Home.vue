<template>
  <div>
    <Tweets />
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
