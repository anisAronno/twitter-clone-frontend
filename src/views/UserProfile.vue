<template>
  <div
    class="grid place-items-center pt-10 text-gray-900 bg-white dark:text-white dark:bg-gray-900"
    v-if="user.id"
  >
    <div class="sm:px-6">
      <div class="flex justify-center relative">
        <img
          v-if="user.image"
          :src="user.image"
          :alt="user.name"
          class="avatar w-24 h-24 xl:w-30 xl:h-30"
        />
      </div>
      <div class="flex gap-10 my-7 justify-center items-center">
        <div class="grid place-items-center gap-2">
          <p class="text-xl text-red-600">
            {{ user.tweets_count }}
          </p>
          <dt class="text-md">Total Tweets</dt>
        </div>
        <div class="grid place-items-center gap-2">
          <p class="text-xl text-red-600">
            {{ user.followers_count }}
          </p>
          <dt class="text-md">Total Followers</dt>
        </div>
        <div class="grid place-items-center gap-2">
          <p class="text-xl text-red-600">
            {{ user.following_count }}
          </p>
          <dt class="text-md">Total Following</dt>
        </div>
      </div>
    </div>
    <h1 class="my-5 flex justify-center items-center h-full heading gap-2">
      <span
        v-if="user.isFollowing"
        @click="unFollow(user.id)"
        class="btn-unFollow !text-xl cursor-pointer"
        >Unfollow</span
      >
      <span
        v-else
        @click="follow(user.id)"
        class="btn-follow !text-xl cursor-pointer"
        >Follow</span
      >
    </h1>
    <div class="min-w-full border-gray-200 flex justify-center !text-left pb-5">
      <dl class="card max-w-2xl">
        <div class="profile-item-light">
          <dt class="profile-label">Name</dt>
          <dd class="profile-description">
            {{ user.name }}
          </dd>
        </div>
        <div class="profile-item">
          <dt class="profile-label">User Name</dt>
          <dd class="profile-description">
            {{ user.username }}
          </dd>
        </div>
        <div class="profile-item">
          <dt class="profile-label">Email</dt>
          <dd class="profile-description">
            {{ user.email }}
          </dd>
        </div>
      </dl>
    </div>
    <div class="w-full">
      <Tweets :username="user.username"></Tweets>
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
      isLoading: false,
      user: {
        id: "",
        name: "",
        email: "",
        image: "",
        username: "",
        tweets_count: 0,
        followers_count: 0,
        following_count: 0,
        isFollowing: false,
        created_at: "",
      },
    };
  },
  computed: {
    tweets() {
      return this.$store.getters.tweets;
    },
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      this.$http
        .get(this.$api(`/user-profile/${this.$route.params.id}`))
        .then((response) => {
          if (response.data) {
            this.user = response.data.data;
            this.isLoading = true;
          } else {
            this.$notification(response.data.message, response.data.success);
          }
        })
        .catch((error) => {
          this.$notification(
            error?.response?.data
              ? error?.response?.data?.message
              : error?.message ?? "The given data was invalid!"
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    follow(id) {
      this.$http
        .post(this.$api("/follow"), { following_id: id })
        .then((res) => {
          if (res.status == 200) {
            let data = this.tweets.map((item) => {
              if (item.user.id === this.user.id) {
                item.user.isFollowing = true;
              }
              return item;
            });

            this.$store.dispatch("tweets", data);

            this.user.followers_count = Number(this.user?.followers_count) + 1;
            this.user.isFollowing = true;

            this.$notification(res.data.message, res.data.success);
          } else {
            this.$notification(res.data.message, res.data.success);
          }
        })
        .catch((err) => {
          this.$notification(err.message, "error");
        });
    },
    unFollow(id) {
      this.$swal
        .fire({
          title: "Do you want to unfollow this user?",
          showCancelButton: true,
          confirmButtonText: "Unfollow",
          confirmButtonColor: "#d33",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.processUnFollow(id);
          }
        });
    },
    processUnFollow(id) {
      this.$http
        .post(this.$api("/unfollow"), { following_id: id })
        .then((res) => {
          if (res.status == 200) {
            let data = this.tweets.map((item) => {
              if (item.user.id === this.user.id) {
                item.user.isFollowing = false;
              }
              return item;
            });

            this.$store.dispatch("tweets", data);

            this.user.followers_count = Number(this.user?.followers_count) - 1;
            this.user.isFollowing = false;
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
