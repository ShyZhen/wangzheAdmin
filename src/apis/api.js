import request from '../utils/request';

// 小程序登录API
function platformLogin(app_id, platform_id) {
    let params = {'app_id':app_id, 'platform_id':platform_id}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/mpwzadmin/login', params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    platformLogin
}