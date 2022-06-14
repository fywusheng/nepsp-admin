// 运营位相关的数据结构
// ----------------------

export const deepClone = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// 默认的版本号范围
export const defVersionRange = [{
  start: {
    a: "1",
    b: "0",
    c: "0"
  },
  end: {
    a: "1",
    b: "0",
    c: "0"
  }
}]

// 运营位内容搜索栏对应的数据结构
export const defSearch = {
  name: "",
  id: "",
  app_type: "",
  resource_id: "",
  status: "",
  expire: "0"
}

// 运营位搜索栏对应的数据结构
export const defPosSearch = {
  name: "",
  id: "",
  app_type: "",
  status: "",
  code: ""
}

// 新运营位对应的数据结构
export const newOperatePos = {
  name: "",
  code: "",
  app_type: 1, // PC APP
  type: 1, // 图片 商品 专题
  max_size: 1, // 最大展示张数
  img_width: 750,
  img_height: 400,
  style: "", // 单列 双列 三格 四格 banner (样式 column1,column2,column3,column4,banner)
  status: "", // 0 1 未激活 激活
  space_height: 30,
  space_color: "#fff"
}

// 新运营位内容对应的数据结构
export const newOperateCon = {
  name: "",
  resource_id: "",
  resource_name: "",
  resource_type: "", // 图片 商品组 专题
  weight: "",
  start_time: "",
  end_time: "",
  status: 1, // 0 1 未激活 激活
  text: "",
  image_url: "",
  forward_protocol: "",
  forward_param: "", //"uid={uid}"
  forward_code: "", //注: 初始值为空，当选url时才能触发watch
  forward_remark: "",
  item_group_id: "",
  topic_id: "",
  id: "",
  topic_link: ""
}

// 运营位类型
export const positionTypes = {
  IMAGE: 1,
  GOODS: 2,
  IMAGE_LIST: 3,
  NEW_TOPIC: 5
}
