import NEV from "./config.js"


const defaultConfig = {
	loading: true,
	headers: {}
}

function request(method, path, data, config = defaultConfig) {
	debugger
	const token = uni.getStorageSync("token");
	const Authorization = token ? `Bearer ${uni.getStorageSync("token")}` : "";

	if (config.loading) {
		uni.showLoading({
			title: "加载中...",
			mask: true
		});
	}

	return new Promise((resolve, reject) => {
		debugger
		uni.request({
			header: {
				'Authorization': Authorization,
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			},
			url: NEV.BASE_URL + path,
			method: method,
			data: data,
			success(response) {
				debugger
				if (response.data.code !== "200") {
					uni.showToast({
						icon: "none",
						duration: 4000,
						title: response.data.msg
					});
				}
				resolve(response.data);
			},
			fail(err) {
				debugger
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
		});
	});
}

function get(path, data, config) {
	let params = '?'
	for (let key in data) {
		params += `${key}=${data[key]}&`
	}
	// 去掉最后一个多余的 & 符号
	params = params.slice(0, -1)
	path += params
	console.log(path)
	return this.request('GET', path, {}, config)
}

function post(path, data, config) {
	return this.request('POST', path, data, config)
}

function put(path, data, config) {
	return this.request('PUT', path, data, config)
}

function del(path, data, config) {
	return this.request('DELETE', path, data, config)
}

export default {
	request,
	get,
	post,
	del,
	put
}

// 全局请求封装
// export default (path, data = {}, config = defauls) => {
// 	debugger
// 	const token = uni.getStorageSync("token");
// 	const Authorization = token ? `Bearer ${uni.getStorageSync("token")}` : "";

// 	if (config.loading) {
// 		uni.showLoading({
// 			title: "加载中...",
// 			mask: true
// 		});
// 	}

// 	return new Promise((resolve, reject) => {
// 		debugger
// 		uni.request({
// 			header: {
// 				Authorization
// 			},
// 			url: NEV.BASE_URL + path,
// 			method: config.method,
// 			data,
// 			success(response) {
// 				debugger
// 				if (response.data.code !== "200") {
// 					uni.showToast({
// 						icon: "none",
// 						duration: 4000,
// 						title: response.data.msg
// 					});
// 				}
// 				resolve(response.data);
// 			},
// 			fail(err) {
// 				debugger
// 				uni.showToast({
// 					icon: "none",
// 					title: '服务响应失败'
// 				});
// 				console.error(err);
// 				reject(err);
// 			},
// 			complete() {
// 				uni.hideLoading();
// 			}
// 		});
// 	});
// };