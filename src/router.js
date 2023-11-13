import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';
import Forbidden from './views/Forbidden.vue';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Logout from './views/Logout.vue';
import PageNotFound from './views/PageNotFound.vue';
import PasswordRecover from './views/PasswordRecover.vue';
import PasswordReset from './views/PasswordReset.vue';
import Signup from './views/Signup.vue';


Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'active',
    routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guestOnly: true
      }
    }, 
    {
      path: '/password-forget',
      name: 'passwordRecover',
      component: PasswordRecover,
      meta: {
        guestOnly: true
      }
    },
    {
      path: '/password-reset',
      name: 'passwordReset',
      component: PasswordReset,
      meta: {
        guestOnly: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {
        guestOnly: true
      }
    }, 
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
      meta: {
        requiresAuth: true
      },
    },  
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      },
    },  
    {
      path: "/forbidden",
      name: 'Forbidden',
      component: Forbidden
    },
    {
      path: "*",
      name: '404',
      component: PageNotFound
    },
  ],
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!store.getters.isAuthenticated) {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath,
                },
            });
        } else {
            next();
        }
    } else if (to.matched.some((record) => record.meta.guestOnly)) {
        if (store.getters.isAuthenticated) {
            next({
                path: '/',
            });
        } else {
            next();
        }
    } else {
        next();
    }
});
export default router;
