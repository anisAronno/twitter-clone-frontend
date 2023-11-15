<template>
  <div class="p-1 relative min-w-full">
    <div v-if="Object.keys(allTweets).length > 0 && apiResponsed">
      <div
        v-if="
          searchingUserName?.length > 0 &&
          $route.name != 'userProfile' &&
          $route.name != 'profile'
        "
        class="grid place-content-center"
      >
        <p class="flex items-center justify-center">
          Tweets by &nbsp;
          <span class="text-2xl text-yellow-500">
            {{
              Array.isArray(tweets) && tweets.length > 0
                ? tweets[0]?.user?.name
                : ""
            }}
          </span>
          <span class="mx-1">({{ searchingUserName }})</span>
          <span
            class="text-red-600 text-xl cursor-pointer bg-gray-600 rounded-full w-6 h-6 grid place-content-center p-1"
            @click="removeSearchValue"
            >x</span
          >
        </p>
      </div>
      <div
        v-for="tweet in allTweets"
        :key="tweet.id"
        class="space-y-2 mb-10 p-2"
      >
        <div class="flex justify-start items-center gap-3">
          <img
            :src="tweet.user.image"
            :alt="tweet.user.name"
            class="w-12 h-12 rounded-full"
          />
          <div>
            <router-link
              :to="{ name: 'userProfile', params: { id: tweet.user.id } }"
              class="text-lg"
              >{{ tweet.user.name }}</router-link
            >
            <div class="text-lg" v-if="tweet.user?.id != auth?.id">
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
      <div
        class="flex justify-center absolute bottom-0 w-full"
        v-show="noMoreTweets"
      >
        <p class="text-2xl text-red-600 text-center mt-10">No more tweets</p>
      </div>
    </div>
    <div
      v-else-if="apiResponsed && Object.keys(allTweets).length == 0"
      class="h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8 text-red-600"
    >
      <p class="mx-auto max-w-max text-xl md:text-4xl">Tweets not found.</p>
    </div>
    <div
      v-else
      :class="{
        'fixed top-0 left-0 right-0 bottom-0 w-full max-h-screen z-50 overflow-hidden bg-gray-900 opacity-75 flex flex-col items-center justify-center':
          page === 1,
        'fixed bottom-0 left-0 w-full z-50 bg-black bg-opacity-50 flex justify-center items-center':
          page !== 1,
      }"
    >
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
      noMoreTweets: "",
      page: 1,
    };
  },
  props: {
    username: {
      required: false,
      type: String,
    },
  },
  components: {
    Loader,
  },
  computed: {
    allTweets() {
      return this.$store.getters.tweets;
    },
    auth() {
      return this.$store.getters.user;
    },
    searchingUserName() {
      return this.username?.length > 0
        ? this.username
        : this.$store.getters.searchingUserName;
    },
  },
  mounted() {
    this.fetchTweets();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  watch: {
    searchingUserName(newValue, oldValue) {
      this.page = 1;
      this.tweets = [];
      this.fetchTweets();
    },
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
        .get(this.$api("api/tweets"), {
          params: { username: this.searchingUserName, page: this.page },
        })
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
      } else if (scrolledToBottom && this.page === this.pagination.last_page) {
        this.noMoreTweets = true;
        setTimeout(() => {
          this.noMoreTweets = false;
        }, 3000);
      }
    },
    removeSearchValue() {
      this.$store.dispatch("searchingUserName", "");
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
