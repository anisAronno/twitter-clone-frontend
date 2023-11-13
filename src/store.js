import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
    theme: localStorage.getItem('theme') || 'light', 
    tweet: {},
    tweets: [],
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
    tweet( state ) {
      return state.tweet;
    },

    tweets(state) {
      return state.tweets;
    },

    
  }, // getters

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

    tweet( state, payload ) {
      state.tweet = payload;
    },

    updateUser(state, payload) {
      localStorage.removeItem('user')
      state.user = {
        id: payload.data.id,
        name: payload.data.name,
        username: payload.data.username,
        email: payload.data.email,
        image: payload.data.image,
        created_at: payload.data.created_at, 
      };
      localStorage.setItem('user', JSON.stringify(state.user))
    },

    tweets(state, payload) {
      state.tweets = payload;
    },
 

  }, // mutations

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

    tweet( context, payload ) {
      context.commit( 'tweet', payload );
    },

    updateUser( context, payload ) {
      context.commit( 'updateUser', payload );
    },

    tweets( context, payload ) {
      context.commit('tweets', payload);
    },
  }
});
