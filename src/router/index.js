import Vue from 'vue'
import VueRouter from 'vue-router'
import { LocalStorage } from 'quasar'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    const store = Router.app.$store
    if(to.matched.some(record => record.meta.requiresAuth)) {
      if ( typeof(store) !== 'undefined' && store !== null && store.getters['server/isConnected']) {
      /*if (
        LocalStorage.has('server')
        && LocalStorage.getItem('server').host
        && LocalStorage.getItem('server').apiPort
        && LocalStorage.getItem('server').webSocketsPort
        && LocalStorage.getItem('server').isConnected
        && LocalStorage.getItem('server').isConnected == true
      ) {*/
        // is connected to the server
        if ( typeof(store) !== 'undefined' && store !== null && store.getters['user/isLoggedIn']) {
          next()
          return
        }
        next('/login')
      } else {
        // is not connected to the server
        next('/settings')
      }
    } else {
      next()
    }
  })

  return Router
}
