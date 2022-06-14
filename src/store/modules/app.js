import Cookies from "js-cookie"

const state = {
  sidebar: {
    opened: Cookies.get("sidebarStatus") ? !!+Cookies.get("sidebarStatus") : true,
    withoutAnimation: false
  },
  device: "desktop",
  size: Cookies.get("size") || "medium"
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1)
    } else {
      Cookies.set("sidebarStatus", 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set("size", size)
  }
}

const actions = {
  /**
   * @description: 切换侧边菜单栏状态
   * @param {type}
   * @return {type}
   * @author: syx
   */
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR")
  },
  /**
   * @description: 关闭侧边菜单栏
   * @param {type}
   * @return {type}
   * @author: syx
   */
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation)
  },
  /**
   * @description: 切换设备
   * @param {type}
   * @return {type}
   * @author: syx
   */
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device)
  },
  /**
   * @description: 设置大小
   * @param {type}
   * @return {type}
   * @author: syx
   */
  setSize({ commit }, size) {
    commit("SET_SIZE", size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
