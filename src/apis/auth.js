import request from '../utils/request';

// 小程序登录API
function wxmpLogin(code, userInfo) {
    let params = {'code':code, 'user':userInfo}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/oauth/wechat/login', params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 账号密码登录API
function accountLogin(account, password) {
    let params = {"account":account, "password":password}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/login', params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 登出API
function logout() {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/logout').then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}


// 快捷登录
function loginQuick(account, code) {
    let params = {"account":account, "code":code}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/login-quick', params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    wxmpLogin, accountLogin, logout, loginQuick
}