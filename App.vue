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
						if (res.code) {
							const params = {
								loginType: 'wxMiniProgram',
								js_code: res.code,
								grant_type: 'authorization_code'
							}
							request.post('/user-gw/user/login', params)
								.then(response => {
									const userId = response.data.curUser.userId
									const avatarUrl = response.data.curUser.headImg
									const username = response.data.curUser.name
									const nickname = response.data.curUser.nickName
									const token = response.data.token
									const curRole = response.data.curRole
									const curPermissionList = response.data.curPermissionList
									const validRoleList = response.data.validRoleList
									const openid = response.data.wechatLoginRes.openid
									const sessionKey = response.data.wechatLoginRes.session_key
									store.commit('login', {
										"openid": openid,
										"sessionKey": sessionKey,
										"userId": userId,
										"avatarUrl": avatarUrl,
										"username": username,
										"nickname": nickname,
										"token": token,
										"curRole": curRole,
										"validRoleList": validRoleList,
										"curPermissionList": curPermissionList
									});

								}).catch(err => {
									uni.showToast({
										title: '请求出错:' + err,
										icon: 'none'
									})
								})
						} else {
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