import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/icon/iconfont.css'

// 引入summernote
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'popper.js'
import 'summernote'
import 'summernote/dist/summernote.css'
import 'summernote/lang/summernote-zh-CN.js'

import './assets/css/mystyle.css'

Vue.use(ElementUI)
Vue.config.devtools = true
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
