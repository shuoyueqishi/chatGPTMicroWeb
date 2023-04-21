import Vue from 'vue'
import App from './App'
import store from './store/store.js'
import 'static/iconFont.css'
import request from './request/request.js'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$request = request
Vue.prototype.towxml = require('./static/towxml/index.js')

App.mpType = 'app'

const app = new Vue({
	store,
	request,
	...App
})
app.$mount()