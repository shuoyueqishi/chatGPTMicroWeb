import Vue from 'vue'
import App from './App'
import store from './store/store.js'
import 'static/iconFont.css'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.towxml = require('./static/towxml/index.js')

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
