let BASE_URL = ''
if (process.env.NODE_ENV == 'development') {
    BASE_URL = 'localhost:8590' // development环境
} else {
    BASE_URL = 'https://alexon.website' // 生产环境
}
const config = {
	base_url: BASE_URL,
	appId: 'wxbeb0d268cea2ca7a',
	appKey: 'xxxxx'
}

export { config }
