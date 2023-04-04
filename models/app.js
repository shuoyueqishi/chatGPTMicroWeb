import { HTTP } from '../utils/http.js'

class AppModel extends HTTP {
	login(params) {
        return this.request({
            url: `/user/login`,
			method: 'POST',
			data: params
        })
    }
}

export { AppModel }