import Vuex from 'vuex'
import Vue from 'vue'
import util from '@/utils/util.js'

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		openid: uni.getStorageSync('openid'),
		sessionKey: uni.getStorageSync('sessionKey'),
		username: uni.getStorageSync('username'),
		nickname: uni.getStorageSync('nickname'),
		userId: uni.getStorageSync('userId'),
		token: uni.getStorageSync('token'),
		curRole: uni.getStorageSync('curRole'),
		avatarUrl: uni.getStorageSync('avatarUrl'),
		validRoleList: uni.getStorageSync('validRoleList'),
		curPermissionList: uni.getStorageSync('curPermissionList')
	},
	mutations: {
		login(state, data) {
			if (util.isNull(data)) return
			if (util.isStringNotEmpty(data.openid)) {
				uni.setStorageSync('openid', data.openid)
				state.openid = data.openid
			}
			if (util.isStringNotEmpty(data.sessionKey)) {
				uni.setStorageSync('sessionKey', data.sessionKey)
				state.sessionKey = data.sessionKey
			}

			if (util.isStringNotEmpty(data.token)) {
				uni.setStorageSync('token', data.token);
				state.token = data.token;
			}

			if (util.isStringNotEmpty(data.username)) {
				uni.setStorageSync('username', data.username);
				state.username = data.username;
			}

			if (util.isStringNotEmpty(data.nickname)) {
				uni.setStorageSync('nickname', data.nickname);
				state.nickname = data.nickname;
			}

			if (util.isStringNotEmpty(data.userId)) {
				uni.setStorageSync('userId', data.userId);
				state.userId = data.userId;
			}

			if (util.isNotNull(data.curRole)) {
				uni.setStorageSync('curRole', data.curRole);
				state.curRole = data.curRole;
			}

			if (util.isNotNull(data.validRoleList)) {
				uni.setStorageSync('validRoleList', data.validRoleList);
				state.validRoleList = data.validRoleList;
			}

			if (util.isStringNotEmpty(data.avatarUrl)) {
				uni.setStorageSync('avatarUrl', data.avatarUrl);
				state.avatarUrl = data.avatarUrl;
			}

			if (util.isNotNull(data.curPermissionList)) {
				uni.setStorageSync('curPermissionList', data.curPermissionList);
				state.curPermissionList = data.curPermissionList;
			}
		},
		logout(state) {
			if (uni.getStorageSync('openid') !== null) {
				uni.removeStorageSync('openid');
			}
			if (uni.getStorageSync('sessionKey') !== null) {
				uni.removeStorageSync('sessionKey');
			}
			if (uni.getStorageSync('token') !== null) {
				uni.removeStorageSync('token');
			}
			if (uni.getStorageSync('username') !== null) {
				uni.removeStorageSync('username');
			}
			if (uni.getStorageSync('nickname') !== null) {
				uni.removeStorageSync('nickname');
			}
			if (uni.getStorageSync('userId') !== null) {
				uni.removeStorageSync('userId');
			}
			if (uni.getStorageSync('curRole') !== null) {
				uni.removeStorageSync('curRole');
			}
			if (uni.getStorageSync('validRoleList') !== null) {
				uni.removeStorageSync('validRoleList');
			}
			if (uni.getStorageSync('avatarUrl') !== null) {
				uni.removeStorageSync('avatarUrl');
			}
			if (uni.getStorageSync('curPermissionList') !== null) {
				uni.removeStorageSync('curPermissionList');
			}
			state.sessionKey = '';
			state.openid = '';
			state.token = '';
			state.username = '';
			state.nickname = '';
			state.userId = '';
			state.curRole = '';
			state.validRoleList = '';
			state.avatarUrl = '';
			state.curPermissionList = '';
		}
	},
	getters: {
		username(state) {
			return state.username;
		},
		nickname(state) {
			return state.nickname;
		},
		userId(state) {
			return state.userId;
		},
		token(state) {
			return state.token;
		},
		curRole(state) {
			return state.curRole;
		},
		validRoleList(state) {
			return state.validRoleList;
		},
		userImgUrl(state) {
			return state.userImgUrl;
		},
		curPermissionList(state) {
			return state.curPermissionList;
		}
	}
})

export default store