<template>
  <div
    class="p-1 relative min-w-full !mb-20 md:mb-0 font-sans no-select"
    :class="$route.name == 'home' ? 'mt-32 md:mt-20' : ''"
  >
    <div v-if="Object.keys(allTweets).length > 0">
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
        :id="`tweet-${tweet.id}`"
      >
        <div class="flex justify-start items-center gap-3">
          <img
            :src="tweet.user.image"
            :alt="tweet.user.name"
            class="w-12 h-12 rounded-full"
          />
          <div class="w-full">
            <div class="flex gap-2 md:gap-5 items-center justify-start">
              <router-link
                :to="{ name: 'userProfile', params: { id: tweet.user.id } }"
                class="text-lg text-blue-500 font-medium"
              >
                {{ tweet.user.name }}
              </router-link>
              <span v-if="auth.id !== tweet.user.id">
                <span
                  v-if="tweet.user.isFollowing"
                  class="!text-md text-gray-700 dark:text-gray-300"
                  >Following</span
                >
                <span
                  v-else
                  @click="follow(tweet.user)"
                  class="text-md font-semibold cursor-pointer btn-follow !text-md"
                  >Follow</span
                >
              </span>
            </div>
            <div class="flex items-center justify-start gap-3">
              <p class="dark:text-gray-300">{{ tweet.created_at }}</p>
              <div
                v-if="tweet.user?.id == auth?.id"
                class="flex justify-center items-center h-full heading gap-2"
              >
                <router-link
                  class="font-normal text-blue-800"
                  :to="{ name: 'tweetEdit', params: { id: tweet.id } }"
                >
                  <EditIcon class="w-6 h-6" />
                </router-link>
                <span
                  @click="deleteTweet(tweet.id)"
                  class="font-normal text-blue-600 cursor-pointer"
                >
                  <DeleteIcon class="w-8 h-8" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="p-2">
          <div class="mb-2">
            <div
              v-if="!showFullContent[tweet.id] && tweet.content.length > 200"
            >
              <span v-html="tweet.content.slice(0, 200) + '... '"></span>
              <span
                @click="toggleShowContent(tweet.id)"
                class="text-blue-600 cursor-pointer text-sm"
                >Show More</span
              >
            </div>
            <div v-else-if="showFullContent[tweet.id]">
              <span v-html="tweet.content + ' '"></span>
              <span
                @click="toggleShowContent(tweet.id)"
                class="text-blue-600 cursor-pointer text-sm"
                >Show Less</span
              >
            </div>
            <p v-else>
              {{ tweet.content }}
            </p>
          </div>
          <div
            class="relative"
            @mouseleave="
              () => {
                hideReactionCount();
                showReactComponent();
              }
            "
          >
            <div
              class="text-blue-500 flex items-center gap-3 font-medium text-md md:text-lg my-1"
              ref="reactArea"
            >
              <span
                class="cursor-pointer"
                @mouseover="showReactComponent(tweet.id)"
              >
                <span
                  v-if="tweet.user_reactions?.length > 0"
                  class="text-red-400 text-2xl"
                  @click="removeReact(tweet.id)"
                  @touchstart.prevent="handleTouchStart(tweet.id)"
                  @touchend.prevent="handleTouchEnd(tweet.id)"
                  v-html="tweet.user_reactions[0] + ' :'"
                >
                </span>
                <span v-else><button>React:</button> </span>
              </span>
              <span
                class="text-lime-500 cursor-pointer"
                @mouseover="showReactionsCount(tweet.id)"
                >{{ tweet.total_reactions }}</span
              >
            </div>

            <div
              class="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 z-10 absolute bottom-6 left-5 bg-gray-700 max-w-min p-2 rounded-sm"
              v-if="
                reactionID == tweet.id &&
                Object.keys(tweet.reaction_count).length > 0
              "
            >
              <div
                class="flex gap-1 md:gap-2 relative text-md md:text-xl"
                v-for="(reaction, index) in tweet.reaction_count"
                :key="reaction.react"
              >
                <span class="text-white dark:text-white" v-html="index"> </span>
                <span class="text-blue-500"> ({{ reaction }})</span>
              </div>
            </div>

            <div
              class="flex items-center gap-2 md:gap-3 text-red-500 absolute bottom-6 left-2 md:left-5 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 z-10 bg-gray-900 text-2xl p-3 rounded-xl"
              v-if="reactComponentID == tweet.id"
            >
              <p
                v-for="(reactName, index) in tweet.reaction_arr"
                :key="`${reactName.react}-${index}`"
              >
                <span
                  class="cursor-pointer"
                  id="reactContainer"
                  @click="submitReact(tweet.id, reactName)"
                  v-html="reactName"
                >
                </span>
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
      v-else-if="
        apiResponsed &&
        Object.keys(allTweets).length == 0 &&
        searchingUserName?.length > 0
      "
      class="h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8 text-red-600"
    >
      <p class="mx-auto max-w-max text-xl md:text-4xl">
        {{ searchingUserName }} have no Tweets.
      </p>
    </div>
    <div
      v-else-if="apiResponsed && Object.keys(allTweets).length == 0"
      class="h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8 text-red-600"
    >
      <p class="mx-auto max-w-max text-xl md:text-4xl">Tweets not found.</p>
    </div>
    <div
      v-else
      class="fixed top-0 left-0 right-0 bottom-0 w-full max-h-screen z-20 overflow-hidden bg-gray-900 opacity-75 flex flex-col items-center justify-center"
    >
      <span class="w-10 h-10">
        <Loader></Loader>
      </span>
    </div>
    <div
      v-if="!apiResponsed && this.page != 1"
      class="fixed bottom-0 left-0 w-full z-20 bg-opacity-50 flex justify-center items-center mt-3"
    >
      <span class="w-10 h-10">
        <Loader></Loader>
      </span>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import EditIcon from "@/components/EditIcon.vue";
import DeleteIcon from "@/components/DeleteIcon.vue";

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
      touchTimer: null,
      touchHeld: false,
      showFullContent: {},
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
    EditIcon,
    DeleteIcon,
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
    this.page = 1;
    this.tweets = [];
    this.fetchTweets();

    window.addEventListener("scroll", this.handleScroll);
    document.addEventListener("touchstart", this.handleDocumentTouchStart);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    document.removeEventListener("touchstart", this.handleDocumentTouchStart);
  },
  watch: {
    searchingUserName(newValue, oldValue) {
      this.page = 1;
      this.tweets = [];
      this.fetchTweets();
    },
  },

  methods: {
    toggleShowContent(tweetId) {
      this.$set(this.showFullContent, tweetId, !this.showFullContent[tweetId]);
    },
    handleTouchStart(tweetId) {
      this.touchHeld = false;
      if (this.touchTimer) {
        clearTimeout(this.touchTimer);
      }
      this.touchTimer = setTimeout(() => {
        this.touchHeld = true;
        this.showReactComponent(tweetId);
      }, 500);
    },

    handleTouchEnd(tweetId) {
      if (this.touchTimer) {
        clearTimeout(this.touchTimer);
      }
      if (!this.touchHeld) {
        this.removeReact(tweetId);
      }
    },

    handleDocumentTouchStart(event) {
      const reactArea = Array.isArray(this.$refs.reactArea)
        ? this.$refs.reactArea[0]
        : null;

      if (reactArea instanceof Element) {
        const clickedInsideButton =
          event.target.tagName.toLowerCase() === "button";
        const clickedInsideReactContainer =
          event.target.id === "reactContainer";

        if (clickedInsideButton || clickedInsideReactContainer) {
          console.error("Clicked inside reaction container");
        } else if (!reactArea.contains(event.target)) {
          this.hideReactComponent();
        }
      } else {
        console.error("Invalid or no elements found.");
      }
    },

    fetchTweets() {
      this.apiResponsed = false;
      this.$http
        .get(this.$api("/tweets"), {
          params: { username: this.searchingUserName, page: this.page },
        })
        .then((res) => {
          const newTweets = res.data.data.filter((newTweet) => {
            return !this.tweets.some(
              (existingTweet) => existingTweet.id === newTweet.id
            );
          });
          this.tweets.push(...newTweets);
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

    deleteTweet(id) {
      this.$swal
        .fire({
          title: "Are you sure you want to delete this tweet?",
          showCancelButton: true,
          confirmButtonText: "Delete",
          confirmButtonColor: "#d33",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.apiResponsed = false;
            this.$http
              .delete(this.$api(`/tweet/${id}`))
              .then((res) => {
                let data = this.allTweets.filter((item) => item.id !== id);
                this.$store.dispatch("tweets", data);

                let userData = this.auth;
                userData.tweets_count = Number(userData.tweets_count) - 1;
                this.$store.dispatch("updateUser", { data: userData });

                this.$notification(res.data.message, res.data.success);
              })
              .catch((err) => {
                this.$notification(err.message, "error");
              })
              .finally(() => {
                this.apiResponsed = true;
              });
          }
        });
    },

    follow(user) {
      this.$http
        .post(this.$api("/follow"), { following_id: user.id })
        .then((res) => {
          if (res.data.success) {
            let data = this.allTweets.map((item) => {
              if (item.user.id === user.id) {
                item.user.isFollowing = true;
              }
              return item;
            });
            this.$store.dispatch("tweets", data);
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
        .post(this.$api(`/react/${tweetID}`), { react: react })
        .then((res) => {
          if (res.data.success) {
            this.updateTweetReaction(this.allTweets, tweetID, react);
          }
        })
        .catch((err) => {
          this.$notification(err.message, "error");
        })
        .finally(() => {
          this.reactComponentID = "";
        });
    },

    removeReact(tweetID) {
      this.$http
        .post(this.$api(`/remove-react/${tweetID}`))
        .then((res) => {
          if (res.data.success) {
            this.updateTweetReaction(this.allTweets, tweetID);
          }
        })
        .catch((err) => {
          this.$notification(err.message, "error");
        })
        .finally(() => {
          this.reactComponentID = "";
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
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      } else if (scrolledToBottom && this.page === this.pagination.last_page) {
        this.noMoreTweets = true;
        setTimeout(() => {
          this.noMoreTweets = false;
        }, 1000);
      }
    },

    removeSearchValue() {
      this.page = 1;
      this.tweets = [];
      this.fetchTweets();
      this.$store.dispatch("searchingUserName", "");
    },

    showReactionsCount(id = "") {
      this.reactComponentID = "";
      this.reactionID = id;
    },

    hideReactionCount() {
      this.reactionID = "";
    },

    showReactComponent(id = "") {
      this.reactionID = "";
      this.reactComponentID = id;
    },

    hideReactComponent() {
      this.reactComponentID = "";
    },

    updateTweetReaction(tweets, tweetId, newReaction = null) {
      const tweet = tweets.find((t) => t.id === tweetId);

      if (newReaction === null) {
        return this.removeTweetReact(tweet);
      }

      const currentReaction = tweet.user_reactions[0];

      if (currentReaction) {
        tweet.user_reactions[0] = newReaction;

        this.adjustReactionCount(tweet, currentReaction, -1);
        this.adjustReactionCount(tweet, newReaction, 1);
      } else {
        tweet.user_reactions.push(newReaction);
        this.adjustReactionCount(tweet, newReaction, 1);
        tweet.total_reactions++;
      }
    },

    removeTweetReact(tweet) {
      const currentReaction = tweet.user_reactions.shift();
      if (currentReaction) {
        this.adjustReactionCount(tweet, currentReaction, -1);
        tweet.total_reactions--;
      }
    },

    adjustReactionCount(tweet, reaction, change) {
      if (!tweet.reaction_count[reaction]) {
        if (change > 0) {
          tweet.reaction_count[reaction] = 0;
        } else {
          return;
        }
      }

      tweet.reaction_count[reaction] += change;

      if (tweet.reaction_count[reaction] === 0) {
        delete tweet.reaction_count[reaction];
      }
    },
  },
};
</script>
<style>
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
