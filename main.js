import Vue from 'vue'
import App from './App'
import store from './store/store.js'
import 'static/iconFont.css'
import request from './request/request.js'
import util from '@/utils/util.js'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$request = request
Vue.prototype.$util = util
Vue.prototype.towxml = require('./static/towxml/index.js')

App.mpType = 'app'

const app = new Vue({
	store,
	request,
	util,
	...App
})
app.$mount()