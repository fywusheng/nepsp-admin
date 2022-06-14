const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  //用户信息
  token: state => state.user.token,
  roleIdList: state => state.user.roleIdList,
  name: state => state.user.name,
  uact: state => state.user.uact,
  avatar: state => state.user.avatar,
  id: state => state.user.id,
  menuList: state => state.user.menuList,
  menuTree: state => state.user.menuTree,
  //标签栏
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
