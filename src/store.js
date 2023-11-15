import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
    theme: localStorage.getItem('theme') || 'light', 
    followingTweets: {},
    tweets: {},
    tweetsByUserName: {},
    searchingUserName: '',
  },

  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated
    },

    user(state) {
      if (!state.isAuthenticated) {
        return null;
      }

      return state.user;
    },

    theme(state) {
      return state.theme;
    }, 
    followingTweets( state ) {
      return state.followingTweets;
    },

    tweets(state) {
      return state.tweets;
    },

    tweetsByUserName(state) {
      return state.tweetsByUserName;
    },

    searchingUserName(state) {
      return state.searchingUserName;
    },

    
  },  

  mutations: {
    authenticate(state, payload) {
      state.isAuthenticated = true;
      localStorage.setItem('token', payload.access_token);
      
      state.user = {
        id: payload.data.id,
        name: payload.data.name,
        username: payload.data.username,
        email: payload.data.email,
        image: payload.data.image,
        tweets_count: payload.data.tweets_count,
        followers_count: payload.data.followers_count,
        following_count: payload.data.following_count,
        created_at: payload.data.created_at, 
      };

      localStorage.setItem('user', JSON.stringify(state.user))
    },

    theme(state, payload) {
      state.theme = payload

      localStorage.setItem('theme', payload)
    },
 

    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },


    updateUser(state, payload) {
      localStorage.removeItem('user')
      state.user = {
        id: payload.data.id,
        name: payload.data.name,
        username: payload.data.username,
        email: payload.data.email,
        image: payload.data.image,
        tweets_count: payload.data.tweets_count,
        followers_count: payload.data.followers_count,
        following_count: payload.data.following_count,
        created_at: payload.data.created_at, 
      };
      localStorage.setItem('user', JSON.stringify(state.user))
    },


    followingTweets( state, payload ) {
        state.followingTweets = payload;
    },

    tweets(state, payload) {
      state.tweets = payload;
    },
 
    tweetsByUserName(state, payload) {
      state.tweetsByUserName = payload;
    },

    searchingUserName(state, payload) {
      state.searchingUserName = payload;
    },
 

  },  

  actions: {

    login(context, payload) {
      context.commit('authenticate', payload);
    },

    setTheme(context, payload) {
      context.commit('theme', payload);
    },
 
    logout(context) {
      context.commit('logout');
    },

    updateUser( context, payload ) {
      context.commit( 'updateUser', payload );
    },
    
    followingTweets( context, payload ) {
      context.commit( 'followingTweets', payload );
    },

    tweets( context, payload ) {
        context.commit('tweets', payload);
    },

    tweetsByUserName( context, payload ) {
        context.commit('tweetsByUserName', payload);
    },
    
    searchingUserName( context, payload ) {
        context.commit('searchingUserName', payload);
    },
  }
});
