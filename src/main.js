import Vue from 'vue'
import App from './App'
import store from './store'
import { toast, loading, toLogin, toBack, toHome, reLunchBack } from './utils/global.js'

Vue.config.productionTip = false
Vue.prototype.$store = store

Vue.prototype.$loading = loading
Vue.prototype.$toast = toast
Vue.prototype.$toLogin = toLogin
Vue.prototype.$toBack = toBack
Vue.prototype.$toHome = toHome
Vue.prototype.$reLunchBack = reLunchBack

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
