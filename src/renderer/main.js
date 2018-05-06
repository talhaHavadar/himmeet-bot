import Vue from 'vue'
import Vuelidate from 'vuelidate'
import axios from 'axios'
import VueBlu from 'vue-blu'
import 'vue-blu/dist/css/vue-blu.min.css'

import App from './App'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import VueBreadcrumbs from 'vue-breadcrumbs'
import { mapGetters, mapMutations } from 'vuex'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(VueBreadcrumbs)
Vue.use(VueBlu)

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

// inject a handler for `myOption` custom option
Vue.mixin({
  mounted () {
    let matchedRoutes = this.$router.currentRoute.matched.slice()
    let route = matchedRoutes.pop()
    while (route.parent) {
      route = matchedRoutes.pop()
    }
    this.setActiveParentRoute(route.name)
  },
  computed: {
    ...mapGetters([
      'getActiveParentRoute'
    ])
  },
  methods: {
    ...mapMutations([
      'setActiveParentRoute'
    ])
  }
})

sync(store, router)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
