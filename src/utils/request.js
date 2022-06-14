import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import Qs from 'qs'
import router from '@/router/index'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_POP_UPLOAD_URL,
  // withCredentials: true, // send cookies when cross-domain requests
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'//'application/x-www-form-urlencoded;charset=UTF-8'//,
  },
  // transformRequest: [function(data) {
  //   console.log("request.transformRequest: "+ data)
  //   return JSON.stringify(data)//Qs.stringify(data, { arrayFormat: 'brackets' })
  // }],
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    console.log('config::' ,config)
    config.headers['token'] = getToken();
    // 兼容文件上传服务
    if(config.url.startsWith('nepsp-api/')){
      config.baseURL = '/'
    }
    console.log('config::' ,config)
    // do something before request is sent
    if (/application\/json/.test(config.headers['Content-Type'])) {
        //delete config.transformRequest
    }
    if(config.method.toLocaleUpperCase()==='GET'){
      config.data = JSON.stringify(config.data);
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.code === 401) {

      store.dispatch('user/resetToken').then(() => {
        router.replace('/login');
      })
    }

    // if (res.code === 200) {
      return res;
    // }
  },
  error => {
    console.log(error.message) // for debug

    if (error.response.data.code === 401) {
      store.dispatch('user/resetToken').then(() => {
        router.replace('/login');
      })
    }
    return Promise.resolve({
      code: 500,
      msg: error.response.data.msg
    })
  }
)

export default service
