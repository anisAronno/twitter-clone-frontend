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
        <span class="relative">
          <label
            v-if="!isLoading"
            class="avatar-upload absolute bottom-1 right-3"
            for="imageUpload"
            >+</label
          >
          <input
            id="imageUpload"
            type="file"
            class="hidden"
            accept="image/*"
            @change="submitAvatar($event)"
          />
        </span>
        <ImageLoader v-if="isLoading"></ImageLoader>
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
      <h1 class="my-5 flex justify-center items-center h-full heading gap-2">
        <span>Your Account</span>
        <router-link
          class="font-normal text-blue-600"
          :to="{ name: 'profileEdit', params: { userId: user.id } }"
        >
          <EditIcon class="w-6 h-6" />
        </router-link>
      </h1>
    </div>
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
import EditIcon from "@/components/EditIcon.vue";
import ImageLoader from "@/components/ImageLoader.vue";
import Tweets from "@/components/Tweets.vue";

export default {
  components: {
    Header,
    ImageLoader,
    Tweets,
    EditIcon,
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
  mounted() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      this.$http
        .get(this.$api("api/profile"))
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
    submitAvatar(event) {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file, "image");

      this.$http
        .post(this.$api("api/avatar-upload"), formData, config)
        .then((response) => {
          if (response.data) {
            this.$store.dispatch("updateUser", response.data);
            this.$notification("Updated successful.", response.data.success);
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
  },
};
</script>
