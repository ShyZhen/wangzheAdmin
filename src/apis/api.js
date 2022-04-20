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

function getDrawList(type, page, app_id, platform_id) {
    let params = {'app_id':app_id, 'platform_id':platform_id}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/mpwzadmin/draw/'+type+'?page='+page, params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

function editDraw(app_id, platform_id, id, title, winner_id, limit_user) {
    let params = {'app_id':app_id, 'platform_id':platform_id, 'title':title,'winner_id':winner_id,'limit_user':limit_user}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/mpwzadmin/edit-draw/'+id, params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

function uniUploadImage(app_id, platform_id, filePath) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: request.buildFullUrl('/V1/mpwzadmin/image'),
            filePath: filePath,
            name: 'image',
            header: request.buildHeader({}),
            success: (uploadRes) => {
                resolve(uploadRes)
            },
            fail: (failRes) => {
                reject(failRes)
            }
        });
    })
}

export {
    platformLogin, getDrawList, editDraw, uniUploadImage
}