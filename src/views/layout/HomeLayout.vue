<template>
  <section
    class="p-5 dark:bg-gray-900 dark:text-white bg-white text-gray-900 min-h-screen"
  >
    <div class="grid grid-cols-6">
      <div class="sidebar-area md:col-span-1">
        <!-- left sidebar  -->
      </div>
      <div class="content-area col-span-6 md:col-span-4">
        <router-view @back="back" @loaded="loaded"></router-view>
      </div>
      <div class="sidebar-area md:col-span-1">
        <!-- right sidebar  -->
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
  },  

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
