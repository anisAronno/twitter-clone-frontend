import axios from "axios"
import moment from "moment"
import Vue from 'vue'
import App from './App.vue'
import './assets/style.css'
import router from './router'
import store from './store'

Vue.prototype.moment = moment;

Vue.prototype.$api = function( endpoint ) {
    return 'http://tweeter.test/' + endpoint;
};

const token = localStorage.getItem("token");

if ( localStorage.getItem("token") ) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

new Vue({
  router,
  store,
  render: (h) => h(App),

  created() {
    var vm = this;
    this.$http.interceptors.response.use(undefined, function(error) {
      if (error.response.status === 401) {
        vm.$store.dispatch("logout");  
        router.push("/login");
      } else if (error.response.status === 403) {
        router.push("/forbidden");
      } else if (error.response.status >= 500 && error.response.status !== 503) {
        vm.$message.error('Unknown error occurred.');
      }

      return Promise.reject(error);
    });
  }
}).$mount('#app')