import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
    theme: localStorage.getItem('theme') || 'light', 
    project: {},
    projects: [],
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
    project( state ) {
      return state.project;
    },

    projects(state) {
      return state.projects;
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

    project( state, payload ) {
      state.project = payload;
    },

    updateUser(state, payload) {
      localStorage.removeItem('user')
      state.user = {
        id: payload.id,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        timezone: payload.timezone,
        uuid: payload.uuid,
        subscribed: payload.subscribed,
        allow_premium: payload.allow_premium,
      };
      localStorage.setItem('user', JSON.stringify(state.user))
    },

    projects(state, payload) {
      state.projects = payload;
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

    project( context, payload ) {
      context.commit( 'project', payload );
    },

    updateUser( context, payload ) {
      context.commit( 'updateUser', payload );
    },

    projects( context, payload ) {
      context.commit('projects', payload);
    },
  }
});
