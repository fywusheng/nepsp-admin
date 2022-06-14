# 后台管理系统开发模板

## 安装依赖
```
yarn install
```

### 本地环境代理启动命令
```
npm run serve

```
### 代码提交前eslint规则校验与修复
```
npm run lint --fix
```

### 发布测试环境打包命令
```
npm run build:test
```
### 发布线上环境打包命令
```
npm run build:prod
```

### 更多自定义配置
See [Configuration Reference](https://cli.vuejs.org/zh/config/).

### 基础UI组件库-ElementUI

### 代理
本地设置跨域代理
### 访问环境变量方式
 `console.log(process.env.VUE_APP_SECRET)`
### 自动创建组件模板命令
```
npm run new:comp
```

运行命令后，输入页面名称，自动创建组件模板

### 自动创建页面模板命令
```
npm run new:view
```

运行命令后，输入页面名称，自动创建页面模板

### 路由自动加载
在文件夹router下创建模块路由文件。自动引入新建路由模块。

```js
export let routes = []
const routerContext=require.context('./',true,/index\.js$/)
routerContext.keys().forEach(route=>{
  if(route.startsWith('./index')){
    return
  }
  const routerModule=routerContext(route)
  routes=[...routes,...(routerModule.default||routerModule)]
})
```
### 本地mock的使用
> 说明：在一些特殊情况下，前端需要调用接口请求数据但是后端暂时没有该接口时，为了养成良好的代码习惯与风格，可以利用mockjs来实现本地数据mock。用法如下：
1. 在api文件下编写对应接口(路径：/src/api/modules/user.js)
```js
// useMock 代表该请求是否使用本地mock
export function getMockData() {
  return request({
    url: "/mock/api/data/get",
    method: "get",
    useMock: true
  })
}
```

2. 在mock文件夹下写好对应方法(路径：/mock/user.js)
```js
export default [
  {
    url: '/mock/api/data/get',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: 'kjfdhsfaldsfashll'
      }
    }
  }
]
```

3. 在需要调用该接口的页面使用(路径：/src/view/test/index.vue)
```js
// userApi 是用来在api文件下统一管理user的相关api
import { userApi } from "@/api"; 
export default {
  methods: {
  async onClickMainBtn() {
    const res = await userApi.getMockData()
    console.log("res: ", res) // res 为自定义的mock数据
  }
}

```


### 自动全局组件注册
放在`/components/global`文件夹下的组件会全局自动注册。

```js
// 自动加载 global 目录下的 .vue 结尾的文件
const componentsContext = require.context('./global', true, /\.vue$/)
componentsContext.keys().forEach(component => {
  const componentConfig = componentsContext(component)
  /**
  * 兼容 import export 和 require module.export 两种规范
  */
  const ctrl = componentConfig.default || componentConfig
  Vue.component(ctrl.name, ctrl)
})
```
### 关闭preload 和 Prefetch


```js
/*
    preload 和 Prefetch 链接将会消耗带宽。
    如果你的应用很大且有很多 async chunk，
    而用户主要使用的是对带宽较敏感的移动端，
    那么你可能需要关掉 prefetch 链接并手动选择要提前获取的代码区块。
    Vue CLI 应用会为所有初始化渲染需要的文件自动生成 preload 提示
    官方文件很坑爹的,官网文档是错的,他改名字了,要自己打印出来
    console.log(config)
*/

config.plugins.delete("prefetch-index")
config.plugins.delete("preload-index")

```
>  当 prefetch 插件被禁用时，你可以通过 webpack 的内联注释手动选定要提前获取的代码区块：

```js
import(/* webpackPrefetch: true */ './someAsyncComponent.vue')
```
