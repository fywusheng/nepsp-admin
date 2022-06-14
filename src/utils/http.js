/**
 * 封装请求
 */
import 'es6-promise/auto'
import diversion from './diversion'
import handleError from './error'
import axios from 'axios'
import eventbus from './eventbus';

function defaults() {
    return {
        baseURL: `${process.env.VUE_APP_CMS_API}`,
        withCredentials: true,
        headers: {
            'token': window.localStorage.getItem('token')
        },
    }
}

async function fetch() {
    let customOptions = [].pop.apply(arguments)
    let options = defaults()
    if (customOptions) {
        if (customOptions.baseURL) {
            options.baseURL = customOptions.baseURL
        }
        if (customOptions.params) {
            options.params = customOptions.params
        }
    }
    let method = [].shift.apply(arguments)
    const result = await diversion(() => {
        return axios[ method ](...arguments, options).catch((err) => {
            handleError(err)
            throw err
        })
    })
    if (result.code === 403) {
        eventbus.$emit('accessTokenExpire')
    }
    return result;
}


export const get = (url, params, options) => {
    return fetch('get', url, Object.assign(options || {}, {params }))
}
export const post = (url, data, options) => {
    return fetch('post', url, data, options)
}
export const put = (url, data, options) => {
    return fetch('put', url, data, options)
}
export const del = (url, options) => {
    return fetch('delete', url, options)
}
