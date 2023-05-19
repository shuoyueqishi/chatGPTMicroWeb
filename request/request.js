import NEV from "./config.js"
import util from "@/utils/util.js"


function request(method, path, data, header = {}) {
	uni.showLoading({
		title: "加载中...",
		mask: true
	})
	let reqHeaders = {
		'token': uni.getStorageSync("token"),
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json'
	}
	for (let key in header) {
		reqHeaders.put(key, data[key])
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: NEV.BASE_URL + path,
			method: method || 'GET',
			data: data || {},
			header: reqHeaders,
			success(response) {
				if (response.data.code !== "200") {
					uni.showToast({
						icon: "none",
						duration: 5000,
						title: response.data.msg
					});
				}
				resolve(response.data);
			},
			fail(err) {
				uni.showToast({
					icon: "none",
					title: '服务响应失败'
				});
				console.error(err);
				reject(err);
			},
			complete() {
				uni.hideLoading();
			}
		})
	})
}

function get(path, data, header) {
	let params = '?'
	for (let key in data) {
		params += `${key}=${data[key]}&`
	}
	// 去掉最后一个多余的 & 符号
	params = params.slice(0, -1)
	path += params
	console.log(path)
	return this.request('GET', path, null, header)
}

function post(path, data, header) {
	if (util.isNull(header)) {
		header = {}
	}
	return this.request('POST', path, data, header)
}

function put(path, data, header) {
	if (util.isNull(header)) {
		header = {}
	}
	return this.request('PUT', path, data, header)
}

function del(path, data, header) {
	if (util.isNull(header)) {
		header = {}
	}
	return this.request('DELETE', path, data, header)
}

export default {
	request,
	get,
	post,
	del,
	put
}