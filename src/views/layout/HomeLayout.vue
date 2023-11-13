<template>
  <section class="p-5 dark:bg-gray-900 bg-white min-h-screen">
    <div>
      <Header></Header>

      <div class="content-area">
        <router-view @back="back" @loaded="loaded"></router-view>
      </div>
    </div>
  </section>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  name: "MasterLayout",

  components: {
    Header,
  },

  computed: {
    project() {
      return this.$store.getters.project;
    },
  }, // computed

  methods: {
    fetchProject(slug) {
      this.$http
        .get(this.$api("/v1/plugins/" + slug))
        .then((response) => {
          this.$store.dispatch("project", response.data.data);
        })
        .catch(() => {
          this.$message.error("Unable to switch. Try again...");
        });
    },
    loaded() {
      this.$emit("loaded");
    },
    back() {
      this.$router.back();
    },
  },
};
</script>
