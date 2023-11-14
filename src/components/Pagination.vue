<template>
  <nav aria-label="pagination" class="my-10 flex justify-center">
    <ul class="inline-flex -space-x-px">
      <li
        :class="[
          pagination.current_page === 1 ? 'pagination-active font-bolder ' : '',
          'pagination-link rounded-l-lg text-xl',
        ]"
      >
        <a @click.prevent="changePage(1)">{{ "<<" }}</a>
      </li>
      <li
        :class="[
          pagination.current_page === 1
            ? 'pagination-active font-bolder text-xl'
            : '',
          'pagination-link text-xl',
        ]"
      >
        <a>{{ "<" }}</a>
      </li>

      <li
        v-for="page in pages"
        :key="page"
        @click.prevent="changePage(page)"
        :class="[
          isCurrentPage(page) ? 'pagination-active' : '',
          'pagination-link',
        ]"
      >
        <a>{{ page }} </a>
      </li>

      <li
        :class="[
          pagination.current_page === pagination.last_page
            ? 'pagination-active font-bolder'
            : '',
          'pagination-link  text-xl',
        ]"
      >
        <a @click.prevent="changePage(pagination.current_page + 1)">{{
          ">"
        }}</a>
      </li>
      <li
        :class="[
          pagination.current_page === pagination.last_page
            ? 'pagination-active font-bolder'
            : '',
          'pagination-link rounded-r-lg  text-xl',
        ]"
      >
        <a @click.prevent="changePage(pagination.last_page)">{{ ">>" }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ["pagination", "offset"],
  methods: {
    isCurrentPage(page) {
      return this.pagination.current_page === page;
    },
    changePage(page) {
      if (page > this.pagination.last_page) {
        page = this.pagination.last_page;
      }
      this.pagination.current_page = page;
      this.$emit("paginate");
    },
  },
  computed: {
    pages() {
      let pages = [];

      let from = this.pagination.current_page - Math.floor(this.offset / 2);

      if (from < 1) {
        from = 1;
      }

      let to = from + this.offset - 1;

      if (to > this.pagination.last_page) {
        to = this.pagination.last_page;
      }

      while (from <= to) {
        pages.push(from);
        from++;
      }

      return pages;
    },
  },
};
</script>
