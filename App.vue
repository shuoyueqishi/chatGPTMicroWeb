<script>
	import request from './request/request.js'
	import store from './store/store.js'

	export default {
		data() {
			return {}
		},
		onShow: function() {
			console.log('App Launch')
			this.getLogin()
		},

		methods: {
			getLogin() {
				uni.login({
					success: function(res) {
						debugger
						if (res.code) {
							const params = {
								js_code: res.code,
								grant_type: 'authorization_code'
							}
							request.post('/chat-server/wechat/login', params)
								.then(response => {
									debugger
									const openid = response.data.openid
									const sessionKey = response.data.session_key
									store.commit('login', {
										"openid": openid,
										"sessionKey": sessionKey
									});

								}).catch(err => {
									debugger
									uni.showToast({
										title: '请求出错:' + err.errMsg,
										icon: 'none'
									})
								})
						} else {
							debugger
							uni.showToast({
								title: '获取用户登录Code为空',
								icon: 'none'
							})
						}
					},
					fail: function() {
						uni.showToast({
							title: '获取微信登录Code失败',
							icon: 'none'
						})
					}
				});
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>