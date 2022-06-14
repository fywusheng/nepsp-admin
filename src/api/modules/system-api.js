import yRequest from "../request"
// import axiosRequest from "../common-axios"

const uscPath = eval(process.env.VUE_APP_TEST_LOCAL) ? "api/common" : "/nepsp-api/common"
const kbcPath = eval(process.env.VUE_APP_TEST_LOCAL) ? "api/kbc" : "/nepsp-api/kbc"
/**
 * @description: 获取所有菜单树图
 * @param {type}
 * @return {type}
 * @author: syx
 */
export function getAllMenuList(data = {}, config = {}) {
  const options = Object.assign({
    method: "post",
    url: uscPath + "/api/rbac/menu",
    data
  }, config)
  return yRequest("systemGetAllMenuList", options)
  // return yRequest.post("systemGetAllMenuList", uscPath + "/api/rbac/menu", data, config)
}

/**
 * @description: 通过菜单ID获取子菜单  根目录ID默认0
 * @param {type}
 * @return {type}
 * @author: syx
 */
export function getChildMenuByMenuId(data = {}, config = {}) {
  return yRequest.post("systemGetChildMenuByMenuId", uscPath + "/api/rbac/subMenu", data, config)
}

/**
 * @description: 获取所有菜单URL
 * @param {type}
 * @return {type}
 * @author: syx
 */
export function getAllLeavesNodePath(data = {}, config = {}) {
  return yRequest.post("systemGetAllLeavesNodePath", uscPath + "/api/rbac/getAllLeavesNodePath", data, config)
}

/**
 * @description: 编辑或者新增菜单
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function addEditMenu(data = {}, config = {}) {
  return yRequest.post("systemAddEditMenu", uscPath + "/api/rbac/addEditMenu", data, config)
}

/**
 * @description: 删除菜单
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function delMenu(data = {}, config = {}) {
  return yRequest.post("systemDelMenu", uscPath + "/api/rbac/delMenu", data, config)
}

/**
 * @description: 更改菜单状态
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function updateMenuStas(data = {}, config = {}) {
  return yRequest.post("systemUpdateMenuStas", uscPath + "/api/rbac/updateMenuStas", data, config)
}

/**
 * @description: 后台角色列表
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function getRoles(data = {}, config = {}) {
  return yRequest.post("systemGetRoles", uscPath + "/api/rbac/roles", data, config)
}

/**
 * @description: 删除角色
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function delRole(data = {}, config = {}) {
  return yRequest.post("systemDelRole", uscPath + "/api/rbac/delRole", data, config)
}

/**
 * @description: 角色详情
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function getRoleInfo(data = {}, config = {}) {
  return yRequest.post("systemGetRoleInfo", uscPath + "/api/rbac/getRoleInfo", data, config)
}

/**
 * @description: 新增或编辑角色
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function addEditRole(data = {}, config = {}) {
  return yRequest.post("systemAddEditRole", uscPath + "/api/rbac/addEditRole", data, config)
}

/**
 * @description: 查询用户
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function getMyAddAccts(data = {}, config = {}) {
  return yRequest.post("systemGetMyAddAccts", uscPath + "/web/acct/getMyAddAccts", data, config)
}

/**
 * @description: 删除用户
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function delectAccount(data = {}, config = {}) {
  return yRequest.post("systemDelectAccount", uscPath + "/web/acct/delectAccount", data, config)
}

/**
 * @description: 获取用户详情
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function getAcctById(data = {}, config = {}) {
  return yRequest.post("systemGetAcctById", uscPath + "/web/acct/getAcctById", data, config)
}

/**
 * @description: 获取所有角色
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function getAllRoles(data = {}, config = {}) {
  return yRequest.post("systemGetAllRoles", uscPath + "/web/acct/getRoles", data, config)
}

/**
 * @description: 编辑或新增所有角色
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function addOrEditAccount(data = {}, config = {}) {
  return yRequest.post("systemAddOrEditAccount", uscPath + "/web/acct/addAccount", data, config)
}

/**
 * @description: 为角色配置菜单权限
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function configMenu(data = {}, config = {}) {
  return yRequest.post("systemConfigMenu", uscPath + "/api/rbac/perms", data, config)
}

/**
 * @description: 获取角色菜单权限列表
 * @param {type}
 * @return {type}
 * @author: syx
 */

export function getRoleMenus(data = {}, config = {}) {
  return yRequest.post("systemGetRoleMenus", uscPath + "/api/rbac/roleMenuList", data, config)
}

/**
 * @description: 获取数据字典列表
 * @param {*}
 * @return {*}
 * @author: syx
 */

export function selectDictList(data = {}, config = {}) {
  return yRequest.post("systemSelectDictList", kbcPath + "/iep/web/kbc/sysDic/selectDictList", data, config)
}

/**
 * @description: 字典类型启用/禁用
 * @param {*}
 * @return {*}
 * @author: syx
 */

export function updateDictTypeStatus(data = {}, config = {}) {
  return yRequest.post("systemUpdateDictTypeStatus", kbcPath + "/iep/web/kbc/sysDic/updateDictTypeStatus", data, config)
}

/**
 * @description: 获取数据字典详情
 * @param dictId
 * @return {*}
 * @author: syx
 */

export function dictDetail(data = {}, config = {}) {
  return yRequest.post("systemDictDetail", kbcPath + "/iep/web/kbc/sysDic/selectDict", data, config)
}

/**
 * @description: 添加或者更新数据字典
 * @param {*}
 * @return {*}
 * @author: syx
 */

export function insertOrUpdateDict(data = {}, config = {}) {
  return yRequest.post("systemInsertOrUpdateDict", kbcPath + "/iep/web/kbc/sysDic/insertOrUpdateDict", data, config)
}

/**
 * @description: 删除字典类型
 * @param {*}
 * @return {*}
 * @author: syx
 */

export function delDictTypeCascade(data = {}, config = {}) {
  return yRequest.post("systemDelDictTypeCascade", kbcPath + "/iep/web/kbc/sysDic/delDictTypeCascade", data, config)
}

/**
 * @description: 删除字典数据
 * @param {*}
 * @return {*}
 * @author: syx
 */

export function delDictData(data = {}, config = {}) {
  return yRequest.post("systemDelDictData", kbcPath + "/iep/web/kbc/sysDic/delDictData", data, config)
}