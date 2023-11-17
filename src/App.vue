<template>
  <div id="app">
    <div
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-900 opacity-75 flex flex-col items-center justify-center"
      v-if="!isLoaded"
    >
      <span class="w-10 h-10">
        <Loader></Loader>
      </span>
    </div>
    <Header></Header>
    <router-view @loaded="loaded" class="mt-6 md:mt-10"></router-view>
  </div>
</template>
<script>
import Loader from "@/components/Loader.vue";
import Header from "@/components/Header.vue";

export default {
  components: {
    Loader,
    Header,
  },
  data() {
    return {
      isLoaded: false,
    };
  },
  mounted() {
    this.loaded();
  },
  methods: {
    loaded(data = true) {
      this.isLoaded = data;
    },
  },
};
</script>
