import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		openid: uni.getStorageSync('openid'),
		sessionKey: uni.getStorageSync('sessionKey'),
		username: uni.getStorageSync('username'),
		userId: uni.getStorageSync('userId'),
		token: uni.getStorageSync('token'),
		curRole: uni.getStorageSync('curRole'),
		userImgUrl: uni.getStorageSync('userImgUrl'),
		validRoleList: uni.getStorageSync('validRoleList')
	},
	mutations: {
		login(state, data) {
			debugger;
			uni.setStorageSync('openid', data.openid);
			uni.setStorageSync('sessionKey', data.sessionKey);
			uni.setStorageSync('token', data.token);
			uni.setStorageSync('username', data.username);
			uni.setStorageSync('userId', data.userId);
			uni.setStorageSync('curRole', data.curRole);
			uni.setStorageSync('validRoleList', data.validRoleList);
			uni.setStorageSync('userImgUrl', data.userImgUrl);
			state.openid = data.openid;
			state.sessionKey = data.sessionKey;
			state.token = data.token;
			state.username = data.username;
			state.userId = data.userId;
			state.curRole = data.curRole;
			state.validRoleList = data.validRoleList;
			state.userImgUrl = data.userImgUrl;
		},
		logout(state) {
			debugger;
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
			if (uni.getStorageSync('userId') !== null) {
				uni.removeStorageSync('userId');
			}
			if (uni.getStorageSync('curRole') !== null) {
				uni.removeStorageSync('curRole');
			}
			if (uni.getStorageSync('validRoleList') !== null) {
				uni.removeStorageSync('validRoleList');
			}
			if (uni.getStorageSync('userImgUrl') !== null) {
				uni.removeStorageSync('userImgUrl');
			}
			state.sessionKey = '';
			state.openid = '';
			state.token = '';
			state.username = '';
			state.userId = '';
			state.curRole = '';
			state.validRoleList = '';
			state.userImgUrl = '';
		}
	},
	getters: {
		username(state) {
			return state.username;
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
		}
	}
})

export default store