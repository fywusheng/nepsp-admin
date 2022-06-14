import axios from 'axios';
import Blob from 'blob';
import { getToken } from '@/utils/auth'

// create an axios instance
const HttpService = axios.create({
    baseURL: process.env.VUE_APP_POP_URL,
    // withCredentials: true, // send cookies when cross-domain requests
    headers: {
      'Content-Type': 'application/json;charset=UTF-8' 
    },
    timeout: 60000 // request timeout
})

const BlobHttpService = axios.create({
  baseURL: process.env.VUE_APP_POP_URL,
  // withCredentials: true, // send cookies when cross-domain requests
  responseType: 'blob',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8' 
  },
  timeout: 60000 // request timeout
})
//http request 拦截器
HttpService.interceptors.request.use(
  config => {
    config.headers['token'] = getToken();
    config.data = JSON.stringify(config.data);
    // config.headers = {
    //   'Content-Type':'application/x-www-form-urlencoded'
    // }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

//响应拦截器即异常处理
HttpService.interceptors.response.use(response => {
    return response
}, err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
            console.log('错误请求')
          break;
        case 401:
            console.log('未授权，请重新登录')
          break;
        case 403:
          console.log('拒绝访问')
          break;
        case 404:
          console.log('请求错误,未找到该资源')
          break;
        case 405:
          console.log('请求方法未允许')
          break;
        case 408:
          console.log('请求超时')
          break;
        case 500:
          console.log('服务器端出错')
          break;
        case 501:
          console.log('网络未实现')
          break;
        case 502:
          console.log('网络错误')
          break;
        case 503:
          console.log('服务不可用')
          break;
        case 504:
          console.log('网络超时')
          break;
        case 505:
          console.log('http版本不支持该请求')
          break;
        default:
          console.log(`连接错误${err.response.status}`)
      }
    } else {
      console.log('连接到服务器失败')
    }
    return Promise.resolve(err.response)
})

export default HttpService

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url,params={}){
    return new Promise((resolve,reject) => {
      //alert(JSON.stringify(params))
        HttpService.get(url,{
        params:params
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
    })
}
  
  
/**
* 封装post请求
* @param url
* @param data
* @returns {Promise}
*/
  
export function post(url,data = {}){
    return new Promise((resolve,reject) => {
        HttpService.post(url,data).then(response => {
        resolve(response.data);
    },err => {
            reject(err)
        })
    })
}

export function downloadByPost(url,fileName,data = {}){
  return new Promise((resolve,reject) => {
    BlobHttpService.post(url,data).then(response => {
      const content = response.data
      const blob = new Blob([content],{ type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" });
      if ("download" in document.createElement("a")) {
       // 非IE下载
       const elink = document.createElement("a");
       elink.style.display = "none";
       elink.href = window.URL.createObjectURL(blob);
       document.body.appendChild(elink);
       elink.download = fileName;
       elink.click();
       window.URL.revokeObjectURL(elink.href); // 释放URL 对象
       document.body.removeChild(elink);
      } 
      else {
       // IE10+下载
       navigator.msSaveBlob(blob, fileName);
      }
      resolve(response.data);     
  },err => {
          reject(err)
      })
  })
}
  
/**
* 封装patch请求
* @param url
* @param data
* @returns {Promise}
*/
  
export function patch(url,data = {}){
    return new Promise((resolve,reject) => {
        HttpService.patch(url,data)
           .then(response => {
             resolve(response.data);
           },err => {
             reject(err)
           })
    })
}
  
   /**
   * 封装put请求
   * @param url
   * @param data
   * @returns {Promise}
   */
  
export function put(url,data = {}){
    return new Promise((resolve,reject) => {
        HttpService.put(url,data)
           .then(response => {
             resolve(response.data);
           },err => {
             reject(err)
           })
    })
}