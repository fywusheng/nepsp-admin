import menuItemFormat from "@/assets/data/menu-item-format"
/**
 * @description: 根据菜单树图渲染路由表
 * @param {type} 
 * @return {type} 
 * @author: syx
 */

export function getRouterList(menuList){
  //新的数据列表
  var routerList = []
  for (const i in menuList){
    var routerItem = {}
    var item = menuList[i]
    routerItem.meta = {
      title: item.title || "",
      icon: item.icon || "",
      affix: item.affix || false,
      noCache: item.noCache || false
    }
    routerItem.path = item.path || ""
    //如果存在redirect 则赋值 redirect
    if (item.redirect){
      routerItem.redirect = item.redirect
    }
    //渲染组件
    if(item.name){
      if(item.name === 'layout'){
        routerItem.name = ''
      }else{
        routerItem.name = item.name
      }
      
      routerItem.component = menuItemFormat[item.name]
    }
    if (item.children&&item.children.length > 0){
      //存在子元素才 给 alwaysShow 属性
      routerItem.alwaysShow = item.alwaysShow
      if (!routerItem.component) {
        routerItem.component = () => import("@/layout")
      }
      routerItem.children = getRouterList(item.children)
    }
    routerList.push(routerItem)
  }
  return routerList
}

/**
 * @description: 返回route对象
 * @param {type} 
 * @return {type} 
 * @author: syx
 */
export function getRouteObj(menuObj){
  const route = {
    path: menuObj.path,
    query: {},
    params: {},
    fullPath: menuObj.path,
    name: menuObj.name,
    meta: {
      affix: menuObj.affix || false,
      icon: menuObj.icon || "",
      noCache: menuObj.noCache || false,
      title: menuObj.title || ""
    },
    title: menuObj.title
  }
  return route
}

/**
 * @description: 根据树形数据 返回 数组
 * @param {type} 
 * @return {type} 
 * @author: syx
 */
export function getAllArr(nodes,options){
  let defaultOptions = {
    wantField: "menuId",
    children: "children",
    returnItem: false
  }
  options&&Object.assign(defaultOptions,options)
  var r=[]
  if (Array.isArray(nodes)) {
    for (var i=0, l=nodes.length; i<l; i++) {
      const item = nodes[i]
      if (Array.isArray(item[defaultOptions.children])&&item[defaultOptions.children].length>0){
        // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
        r = r.concat(getAllArr(item[defaultOptions.children],defaultOptions)) 
      } else {
        if (options.returnItem) {
          r.push(item) // 取每项数据放入一个新数组
        } else {
          r.push(item[defaultOptions.wantField]) // 取每项数据放入一个新数组
        }
      }
      delete item[defaultOptions.children]
    }
  }
  return r
}