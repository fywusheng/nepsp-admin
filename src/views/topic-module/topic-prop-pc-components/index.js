import pingou from "./pingou"
import image from "./image"
import title from "./title"
import space from "./space"
import richtext from "./richtext"
import banner from "./banner"
import itemList from "./item-list"
import imageList from "./image-list"

export default [
  {
    title: "图片视频",
    children: [
      {
        title: "品购",
        name: "pc-pingou",
        component: pingou
      },
      {
        title: "单图",
        name: "pc-image",
        component: image
      },
      {
        title: "轮播图",
        name: "pc-banner",
        component: banner
      },
      {
        title: "图片列表",
        name: "pc-image-list",
        component: imageList
      },
      {
        title: "商品列表",
        name: "pc-item-list",
        component: itemList
      }
    ]
  },
  {
    title: "功能",
    children: [
      {
        title: "标题",
        name: "pc-title",
        component: title
      },
      {
        title: "空白",
        name: "pc-space",
        component: space
      },
      {
        title: "富文本",
        name: "pc-richtext",
        component: richtext
      }
    ]
  }
]