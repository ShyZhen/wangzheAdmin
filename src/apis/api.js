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
            formData:{  //后台所需除图片外的参数可以写在这里面
                'app_id':app_id,
                'platform_id':platform_id
            },
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

function addDraw(app_id, platform_id, title, winner_id, limit_user, image) {
    let params = {'app_id':app_id, 'platform_id':platform_id, 'title':title,'winner_id':winner_id,'limit_user':limit_user, 'image': image}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/mpwzadmin/add-draw', params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

function getConvertList(uuid, page, app_id, platform_id) {
    let params = {'app_id':app_id, 'platform_id':platform_id}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/mpwzadmin/skin/'+uuid+'?page='+page, params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

function setSkinStatus(id, uuid, app_id, platform_id) {
    let params = {'app_id':app_id, 'platform_id':platform_id}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/mpwzadmin/skin-status/'+id + '/' +uuid, params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}


export {
    platformLogin, getDrawList, editDraw, uniUploadImage, addDraw, getConvertList, setSkinStatus
}