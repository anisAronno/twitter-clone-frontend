<template>
  <div class="p-1">
    <div v-for="tweet in allTweets" :key="tweet.id" class="space-y-2 mb-2 p-2">
      <div class="flex justify-start items-center gap-3">
        <img
          :src="tweet.user.image"
          :alt="tweet.user.name"
          class="w-12 h-12 rounded-full"
        />
        <div>
          <h1 class="text-lg">{{ tweet.user.name }}</h1>
          <div class="text-lg">
            <span v-if="tweet.user.isFollowing">Following</span>
            <span
              v-else
              @click="follow(tweet.user)"
              class="text-blue-600 cursor-pointer"
              >Follow</span
            >
          </div>
        </div>
      </div>
      <div class="p-2">
        <p>{{ tweet.content }}</p>
        <div
          class="relative"
          @mouseleave="
            () => {
              removeReactions();
              showReactComponent();
            }
          "
        >
          <p class="text-blue-500 flex gap-3">
            <span
              class="cursor-pointer"
              @mouseover="showReactComponent(tweet.id)"
            >
              <span
                v-if="tweet.user_reactions?.length > 0"
                class="text-red-600"
              >
                {{ tweet.user_reactions[0] + ":" }}
              </span>
              <span v-else>React: </span>
            </span>
            <span
              class="text-lime-500 cursor-pointer"
              @mouseover="showReactions(tweet.id)"
              >{{ tweet.total_reactions }}</span
            >
          </p>
          <div
            class="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 z-10 absolute bottom-6 left-5 bg-gray-700 max-w-min p-2 rounded-sm"
            v-if="
              reactionID == tweet.id &&
              Object.keys(tweet.reaction_count).length > 0
            "
          >
            <div
              class="flex gap-2 relative"
              v-for="(reaction, index) in tweet.reaction_count"
              :key="reaction.react"
            >
              <span class="text-white dark:text-white">
                {{ index }}
              </span>
              <span class="text-blue-500"> ({{ reaction }})</span>
            </div>
          </div>

          <div
            class="flex gap-2 text-red-500 absolute bottom-6 left-5 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 z-10"
            v-if="reactComponentID == tweet.id"
          >
            <p
              v-for="(reactName, index) in tweet.reaction_arr"
              :key="`${reactName.react}-${index}`"
              class="bg-gray-400 py-0.25 px-2 rounded-sm"
            >
              <span
                class="cursor-pointer"
                @click="submitReact(tweet.id, reactName)"
              >
                {{ reactName }}</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="loader-container" v-if="!apiResponsed">
      <span class="w-10 h-10">
        <Loader></Loader>
      </span>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";

export default {
  data() {
    return {
      tweets: [],
      pagination: {},
      apiResponsed: true,
      reactionID: "",
      reactComponentID: "",
      page: 1,
    };
  },
  components: {
    Loader,
  },
  computed: {
    allTweets() {
      return this.$store.getters.tweets;
    },
  },
  mounted() {
    this.fetchTweets();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    follow(user) {
      this.$http
        .post(this.$api("api/follow"), { following_id: user.id })
        .then((res) => {
          if (res.data.success) {
            this.tweets = [];
            this.page = 1;
            this.fetchTweets();
            this.$notification(res.data.message, res.data.success);
          } else {
            this.$notification(res.data.message, res.data.success);
          }
        })
        .catch((err) => {
          this.$notification(err.message, "error");
        });
    },

    submitReact(tweetID, react) {
      this.$http
        .post(this.$api(`api/react/${tweetID}`), { react: react })
        .then((res) => {
          if (res.data.success) {
            this.tweets = [];
            this.page = 1;
            this.fetchTweets();
            this.$notification(res.data.message, res.data.success);
          } else {
            this.$notification(res.data.message, res.data.success);
          }
        })
        .catch((err) => {
          this.$notification(err.message, "error");
        })
        .finally(() => {
          this.reactComponentID = "";
        });
    },
    fetchTweets() {
      this.apiResponsed = false;
      this.$http
        .get(this.$api("api/tweets"), { params: { page: this.page } })
        .then((res) => {
          this.tweets.push(...res.data.data);
          this.$store.dispatch("tweets", this.tweets);
          this.pagination = res.data.meta;
        })
        .catch((err) => {
          this.$notification(err.message, "error");
        })
        .finally(() => {
          this.apiResponsed = true;
        });
    },
    handleScroll() {
      const bottomOffset = 100;
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - bottomOffset;

      if (
        scrolledToBottom &&
        this.apiResponsed &&
        this.page < this.pagination.last_page
      ) {
        this.page++;
        this.fetchTweets();
      }
    },
    showReactions(id = "") {
      this.reactComponentID = "";
      this.reactionID = id;
    },
    removeReactions() {
      this.reactionID = "";
    },
    showReactComponent(id = "") {
      this.reactionID = "";
      this.reactComponentID = id;
    },
  },
};
</script>

<style>
.loader-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
