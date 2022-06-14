import defaultSettings from "@/settings"

const { showSettings, tagsView, fixedHeader, sidebarLogo, showHeader, title } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  showHeader: showHeader,
  tagsView: tagsView,
  title: title
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit("CHANGE_SETTING", data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

