<template>
  <div></div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  components: {
    Header,
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
