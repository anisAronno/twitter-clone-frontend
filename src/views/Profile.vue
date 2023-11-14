<template>
  <div class="max-w-2xl pt-10 dark:text-white" v-if="user.id">
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
            v-if="!isSaved"
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
        <ImageLoader v-if="isSaved"></ImageLoader>
      </div>
      <h1 class="my-5 flex justify-center items-center h-full heading gap-2">
        <span>Your Account</span>
        <router-link
          class="font-normal text-blue-600"
          :to="{ name: 'profileEdit', params: { userId: user.id } }"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
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
        <div class="profile-item">
          <dt class="profile-label">Total Tweets</dt>
          <dd class="profile-description">
            {{ user.tweets_count }}
          </dd>
        </div>
        <div class="profile-item">
          <dt class="profile-label">Total Followers</dt>
          <dd class="profile-description">
            {{ user.followers_count }}
          </dd>
        </div>
        <div class="profile-item">
          <dt class="profile-label">Total Following</dt>
          <dd class="profile-description">
            {{ user.following_count }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import ImageLoader from "@/components/ImageLoader.vue";

export default {
  components: {
    Header,
    ImageLoader,
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  data() {
    return {
      isSaved: false,
    };
  },
  methods: {
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
            this.isSaved = true;
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
          this.isSaved = false;
        });
    },
  },
};
</script>
