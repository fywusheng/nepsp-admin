const state = {
  visitedViews: [], //当前选中的标签  存储的是route对象
  cachedViews: [] //设置缓存的菜单页签  存储的是 name属性
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) { return }
    state.visitedViews.push(
      Object.assign({
      }, view, {
        title: view.meta.title || "no-name"
      })
    )
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) { return }
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
  },
  //删除所有 访问过的页面 affix为true的除外
  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  //删除所有 访问过的页面 包括 affix为true
  DEL_ALL_VISITED_VIEWS_INCLUDE_AFFIX: state => {
    state.visitedViews = []
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },
  //根据传入的 view对象 更新
  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  addView({ dispatch }, view) {
    dispatch("addVisitedView", view)
    dispatch("addCachedView", view)
  },
  addVisitedView({ commit }, view) {
    commit("ADD_VISITED_VIEW", view)
  },
  addCachedView({ commit }, view) {
    commit("ADD_CACHED_VIEW", view)
  },

  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delVisitedView", view)
      dispatch("delCachedView", view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit("DEL_VISITED_VIEW", view)
      resolve([...state.visitedViews])
    })
  },
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit("DEL_CACHED_VIEW", view)
      resolve([...state.cachedViews])
    })
  },

  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delOthersVisitedViews", view)
      dispatch("delOthersCachedViews", view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit("DEL_OTHERS_VISITED_VIEWS", view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit("DEL_OTHERS_CACHED_VIEWS", view)
      resolve([...state.cachedViews])
    })
  },
  //删除 访问过的页面(affix为true的除外)及缓存页面
  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delAllVisitedViews", view)
      dispatch("delAllCachedViews", view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  //删除 访问过的页面(包括affix为true)及缓存页面
  delAllViewsIncludeAffix({ dispatch, state }, view) {
    console.log("删除 访问过的页面(包括affix为true)及缓存页面")
    return new Promise(resolve => {
      dispatch("delAllVisitedViewsIncludeAffix", view)
      dispatch("delAllCachedViews", view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  //删除所有访问过的 页面 affix为true的除外
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit("DEL_ALL_VISITED_VIEWS")
      resolve([...state.visitedViews])
    })
  },
  //删除所有访问过的 页面 affix为true的除外
  delAllVisitedViewsIncludeAffix({ commit, state }) {
    return new Promise(resolve => {
      commit("DEL_ALL_VISITED_VIEWS_INCLUDE_AFFIX")
      resolve([...state.visitedViews])
    })
  },
  // 删除所有缓存的 页面
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit("DEL_ALL_CACHED_VIEWS")
      resolve([...state.cachedViews])
    })
  },
  //根据传入的view对象 更新视图
  updateVisitedView({ commit }, view) {
    commit("UPDATE_VISITED_VIEW", view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
