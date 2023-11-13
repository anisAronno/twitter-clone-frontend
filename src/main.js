import axios from "axios"
import moment from "moment"
import 'sweetalert2/dist/sweetalert2.min.css'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueSweetalert2 from 'vue-sweetalert2'
import App from './App.vue'
import './assets/style.css'
import router from './router'
import store from './store'

Vue.prototype.moment = moment;

Vue.use(VueSweetalert2);

Vue.use(VueAxios, axios);

Vue.prototype.$api = function( endpoint ) {
    return 'http://twitter.test/' + endpoint;
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
        
    let toaster = this.$swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.onmouseenter = swal.stopTimer;
        toast.onmouseleave = swal.resumeTimer;
        }
    });
    
    Vue.prototype.$notification = function(message, success = true) {
        return toaster.fire({
        icon: success? 'success': 'error',
        title: message,
        });
    };
      
    var vm = this;
    this.$http.interceptors.response.use(undefined, function(error) {
      if (error.response.status === 401) {
        vm.$store.dispatch("logout");  
        router.push("/login");
      } else if (error.response.status === 403) {
        router.push("/forbidden");
      } else if (error.response.status >= 500 && error.response.status !== 503) {
        vm.$notification.error('Unknown error occurred.');
      }

      return Promise.reject(error);
    });
  }
}).$mount('#app')