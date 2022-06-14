import { userApi } from "@/api"
import { getToken, setToken, removeToken, setRefreshToken, getRefreshToken, removeRefreshToken } from "@/utils/auth"
import {getRouterList, getAllArr, getRouteObj} from "@utils/getRouterList"
import router, { resetRouter } from "@/router"
import { deepClone } from "@/utils/deep-copy"
import store from "@/store"

const getDefaultState = () => {
  return {
    token: getToken(), //用户登录凭证
    refreshToken: getRefreshToken(), //用户刷新token凭证
    name: "", //用户名
    avatar: "", //用户头像
    roleIdList: [], //用户拥有的角色Id数组
    uact: "", //用户账号
    id: "", //用户ID
    menuList: [], //用户拥有的菜单权限树（包含用户信息 404页面等）
    menuTree: [] //用户拥有的菜单权限树
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_UACT: (state, uact) => {
    state.uact = uact
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_MENU_ROLE_ID_LIST: (state, roleIdList) => {
    state.roleIdList = roleIdList
  },
  SET_MENU_LIST: (state, menuList) => {
    state.menuList = menuList
  },
  SET_MENU_TREE: (state, menuTree) => {
    state.menuTree = menuTree
  }
}

const actions = {
  /**
   * @description: 设置name
   * @param {type}
   * @return {type}
   * @author: syx
   */
  setName({ commit }, name){
    commit("SET_NAME", name)
  },
  /**
   * @description: test
   * @param {type}
   * @return {type}
   * @author: camus
   */
  setId({ commit }, id){
    commit("SET_ID", id)
  },

  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      userApi.login(userInfo).then(response => {
        const { data } = response
        commit("SET_TOKEN", data.accessToken)
        setToken(data.accessToken)
        commit("SET_REFRESH_TOKEN", data.refreshToken)
        setRefreshToken(data.refreshToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      userApi.getInfo().then(data => {
        if (!data) {
          reject("Verification failed, please Login again.")
        }
        const { userNknm, uactId, uact, menuTree, roleIdList } = data.data
        commit("SET_UACT", uact)
        commit("SET_ID", uactId)
        commit("SET_NAME", userNknm)
        commit("SET_MENU_TREE", menuTree)
        commit("SET_MENU_ROLE_ID_LIST", roleIdList)
        const personalInfo = {
          path: "/",
          alwaysShow: false,
          title: "个人信息",
          icon: "el-icon-user",
          redirect: "/my-module/personal-info",
          name: "layout",
          children: [{
            path: "/my-module/personal-info",
            name: "myPersonalInfo",
            title: "个人信息",
            icon: "el-icon-user",
            affix: true,
            noCache: true
          }]
        }
        const copyMenuTree = deepClone(menuTree)
        copyMenuTree.unshift(personalInfo)
        commit("SET_MENU_LIST", copyMenuTree)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      userApi.logout().then(() => {
        removeToken() // 删除token
        removeRefreshToken() //删除refreshToken
        dispatch("tagsView/delAllViewsIncludeAffix", {}, { root: true }) //删除菜单页签
        resetRouter()//重置路由
        commit("RESET_STATE")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit("RESET_STATE")
      resolve()
    })
  },

  /**
 * @description: 重新加载菜单列表
 * @param {type}
 * @return {type}
 * @author: syx
 */
  async reloadMenu({ dispatch, state }) {
    await dispatch("getInfo") //获取用户信息
    await dispatch("judgeRemoveViewsTags") //判断是否需要去除菜单页签
    const menuList = state.menuList
    const routerList = getRouterList(menuList)
    const notFound = {
      path: "*",
      name: "notFound",
      component: () => import(/* webpackChunkName: "commonModule" */ "@/views/error-page")
    }
    routerList.push(notFound)
    resetRouter()
    router.addRoutes(routerList)
    console.log("菜单", routerList)
  },
  /**
   * @description: 判断是否移除菜单页签
   * @param {*}
   * @return {*}
   * @author: syx
   */  
  judgeRemoveViewsTags({ dispatch, state }) {
    const menuList = deepClone(state.menuList)
    const pathList = getAllArr(menuList, { wantField: "path" })
    const tagViews = Array.from(store.getters.visitedViews)
    const copyTagViews = [] //解决不复制一个tagviews时，后面删除tagsview导致长度变短，然后就一些删不到， 因为tagsview存在各种别的 原型链，深拷贝不了
    for (let i = 0; i < tagViews.length; i++) {
      const item = tagViews[i]
      const obj = {
        fullPath: item.fullPath,
        meta: {
          affix: item.meta.affix,
          icon: item.meta.icon,
          noCache: item.meta.noCache,
          title: item.meta.title
        },
        name: item.name,
        path: item.path,
        title: item.title
      }
      copyTagViews.push(obj)
    }

    const menuTreeList = deepClone(state.menuList)
    const menuItemList = getAllArr(menuTreeList, {returnItem: true})
    for (let index = 0; index < copyTagViews.length; index++) {
      const item = copyTagViews[index]
      const judge = pathList.some(pathItem => {
        return (pathItem === item.fullPath) //当path一样时 保留  不一样时 带参数那种统一不保留
      })
      if (!judge) {
        dispatch("tagsView/delView", item, { root: true }) //删除菜单页签
      } else {
        const viewItem = menuItemList.filter(menuItem => {
          return menuItem.path === item.fullPath
        })[0]
        //判断是否改变了菜单名字
        if (viewItem.title !== item.title) {
          //转化为长得和router对象差不多的对象
          const routeItem = getRouteObj(viewItem)
          dispatch("tagsView/updateVisitedView", routeItem, { root: true }) //更新菜单页签
        }
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

