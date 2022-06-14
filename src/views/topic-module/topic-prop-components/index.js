import pingou from "./pingou"
import image from "./image"
// import fixedImage from "./fixed-image"
import title from "./title"
import space from "./space"
import richtext from "./richtext"
import banner from "./banner"
import itemList from "./item-list"
import itemHscroll from "./item-hscroll"
import imageList from "./image-list"
// import banner2 from "./banner2"
// import navbar from "./navbar"

export default [
  {
    title: "图片视频",
    children: [
      {
        title: "品购",
        name: "pingou",
        component: pingou
      },
      {
        title: "单图",
        name: "image",
        component: image
      },
      {
        title: "轮播图",
        name: "banner",
        component: banner
      },
      // {
      //     title: '轮播图(一屏多图)',
      //     name : 'banner2',
      //     component : banner2
      // },
      //{
      //    title: '视频',
      //    name : 'video',
      //    component : video
      //},
      //{
      //    title: '贴底悬浮图',
      //    name : 'fixed-image',
      //    component : fixedImage
      //},
      {
        title: "图片列表",
        name: "image-list",
        component: imageList
      },
      {
        title: "滑动商品组",
        name: "item-hscroll",
        component: itemHscroll
      },
      {
        title: "商品列表",
        name: "item-list",
        component: itemList
      }
    ]
  },
  {
    title: "功能",
    children: [
      {
        title: "标题",
        name: "title",
        component: title
      },
      {
        title: "空白",
        name: "space",
        component: space
      },
      //{
      //    title: '导航栏',
      //    name : 'navbar',
      //    component : navbar
      //},
      {
        title: "富文本",
        name: "richtext",
        component: richtext
      }
    ]
  }
]
