let BASE_URL = ''
if (process.env.NODE_ENV == 'development') {
	BASE_URL = 'http://8.217.31.124:8590' // development环境
} else {
	BASE_URL = 'https://alexon.website' // 生产环境
}
const config = {
	base_url: BASE_URL,
	appId: 'wxbeb0d268cea2ca7a',
	appKey: '859f103541f32df31410e207c4482c02'
}

export {
	config
}