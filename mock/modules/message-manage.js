export default [
  {
    url: "/mock/api/notice/get",
    type: "get",
    response: res => {
      return {
        type: "success",
        msg: "成功",
        data: [
          {
            id: "s135fa1s",
            title: "这个是标题111",
            publishType: 1,
            publishTypeName: "APP",
            content: "这是内容11111",
            publishCount: 3,
            code: 1104608,
            status: true,
            statusName: "开启",
            backgroundUrl: "../../assets/imgs/common/footer-icon-fault.png"
          },
          {
            id: "d32sd1g35ds3",
            title: "这个是标题222",
            publishCount: 13,
            code: 1002568,
            publishType: 2,
            publishTypeName: "小程序",
            content: "这是内容222",
            status: true,
            statusName: "开启",
            backgroundUrl: "../../assets/imgs/common/footer-icon-fault.png"
          },
          {
            id: "ff5sd4f35s1fs",
            title: "这个是标题333",
            publishType: 1,
            publishCount: 98,
            code: 10698465,
            publishTypeName: "APP",
            content: "这是内容333",
            status: true,
            statusName: "开启",
            backgroundUrl: "../../assets/imgs/common/footer-icon-fault.png"
          },
          {
            id: "qwgf165135",
            title: "这个是标题444",
            publishCount: 39,
            code: 150981867,
            publishType: 2,
            publishTypeName: "小程序",
            content: "这是内容444",
            status: true,
            statusName: "开启",
            backgroundUrl: "../../assets/imgs/common/footer-icon-fault.png"
          },
          {
            id: "rgd3153wes",
            title: "这个是标题555",
            publishType: 2,
            publishCount: 556,
            code: 16068941,
            publishTypeName: "小程序",
            content: "这是内容555",
            status: false,
            statusName: "关闭",
            backgroundUrl: "../../assets/imgs/common/footer-icon-fault.png"
          },
          {
            id: "htdds2vh",
            title: "这个是标题666",
            publishType: 1,
            publishCount: 302,
            code: 665904130,
            publishTypeName: "APP",
            content: "这是内容666",
            status: false,
            statusName: "关闭",
            backgroundUrl: "../../assets/imgs/common/footer-icon-fault.png"
          },
          {
            id: "herth22233535sa",
            title: "这个是标题777",
            publishType: 2,
            publishTypeName: "小程序",
            publishCount: 49,
            code: 8890012,
            content: "这是内容777",
            status: true,
            statusName: "开启",
            backgroundUrl: "../../assets/imgs/common/footer-icon-fault.png"
          }
        ],
        total: 7,
        pageNo: 1
      }
    }
  },
  {
    url: "/mock/api/notice/delete",
    type: "delete",
    response: res => {
      return {
        type: "success",
        msg: "成功11"
      }
    }
  },
  {
    url: "/mock/api/notice/edit",
    type: "post",
    response: res => {
      return {
        type: "success",
        msg: "成功edit"
      }
    }
  },
  {
    url: "/mock/api/notice/add",
    type: "post",
    response: res => {
      return {
        type: "success",
        msg: "成功add"
      }
    }
  },
  {
    url: "/mock/api/notice/push",
    type: "post",
    response: res => {
      return {
        type: "success",
        msg: "推送成功"
      }
    }
  },
  {
    url: "/mock/api/shortMsg/publishers",
    type: "get",
    response: res => {
      return {
        type: "success",
        msg: "成功",
        data: [
          {
            id: 'fd13s5dgs3',
            fullname: '王建国'
          },
          {
            id: 'gs6gaf845a',
            fullname: '李国富'
          },
          {
            id: 'hngvju875s',
            fullname: '张翠兰'
          }, {
            id: 'fhgt4egh45',
            fullname: '陈国生'
          }
          , {
            id: 'jkdsgbdg45763s',
            fullname: '赵丽红'
          }
        ]
      }
    }
  },
  {
    url: "/mock/api/shortMsg/list",
    type: "get",
    response: res => {
      return {
        type: "success",
        msg: "成功",
        data: [
          {
            id: 'dsglkf1rrtdddddddf1',
            fullname: '王建国',
            publisher: 'dasjk2wqekq1',
            publishDate: '2020-08-25 22:45:31',
            receiveNum: 200,
            content: '就开始发动机可的解放碑数据库会不会vkjfdvskfvslb的快捷方式给梁家辉是的深V封神榜，萨芬健康疼那别反身代词，书法课高房价的伙食费与菲亚特发动机粉红色国际化卡高科技，规范第三个，好vsg看得见高儿科孤儿VB和！'
          },
          {
            id: 'tr4613dgf4d3',
            publisher: 'fdhd3415dfwe',
            publishDate: '2020-08-28 12:15:22',
            receiveNum: 100,
            content: '就开始发动机可的解放碑数据库会不会vkjfdvskfvslb的快捷方式给梁家辉是的深V封神榜，萨芬健康疼那别反身代词，书法课高房价的伙食费与菲亚特发动机粉红色国际化卡高科技，规范第三个，好vsg看得见高儿科孤儿VB和！',
            fullname: '李国富'
          },
          {
            id: 'hfd365yu768ig2',
            publisher: 'bxgrt4521dv',
            publishDate: '2020-08-28 17:44:12',
            receiveNum: 88,
            content: '就开始发动机可的解放碑数据库会不会vkjfdvskfvslb的快捷方式给梁家辉是的深V封神榜，萨芬健康疼那别反身代词，书法课高房价的伙食费与菲亚特发动机粉红色国际化卡高科技，规范第三个，好vsg看得见高儿科孤儿VB和！',
            fullname: '张翠兰'
          }, {
            id: 'h65thg45jyh9585dg',
            publisher: '6etsjfgxj11d95',
            publishDate: '2020-09-05 06:16:57',
            receiveNum: 170,
            content: '就开始发动机可的解放碑数据库会不会vkjfdvskfvslb的快捷方式给梁家辉是的深V封神榜，萨芬健康疼那别反身代词，书法课高房价的伙食费与菲亚特发动机粉红色国际化卡高科技，规范第三个，好vsg看得见高儿科孤儿VB和！',
            fullname: '陈国生'
          },
          {
            id: 'htr4482sdf1003a',
            publisher: 'dskjh1r509fhds1',
            publishDate: '2020-09-18 12:33:58',
            receiveNum: 556,
            content: '就开始发动机可的解放碑数据库会不会vkjfdvskfvslb的快捷方式给梁家辉是的深V封神榜，萨芬健康疼那别反身代词，书法课高房价的伙食费与菲亚特发动机粉红色国际化卡高科技，规范第三个，好vsg看得见高儿科孤儿VB和！',
            fullname: '赵丽红'
          }
        ],
        total: 15
      }
    }
  },
  {
    url: "/mock/api/shortMsg/delete",
    type: "delete",
    response: res => {
      return {
        type: "success",
        msg: "删除成功delete"
      }
    }
  },
  {
    url: "/mock/api/shortMsg/add",
    type: "post",
    response: res => {
      return {
        type: "success",
        msg: "发送成功"
      }
    }
  },
  {
    url: "/mock/api/insideMsg/list",
    type: "get",
    response: res => {
      return {
        type: "success",
        msg: "成功",
        data: [
          {
            id: "s135fa1s",
            title: "这个是标题111",
            publisher: "admin",
            receiver: "APP",
            content: "这是内容11111",
            code: 1104608,
            readStatus: 1,
            readStatusName: "已读",
            publishDate: "2020-08-06 10:22:56"
          },
          {
            id: "hfgjf4375ytgd4y2",
            title: "这个是标题222",
            publisher: "admin",
            receiver: "APP",
            content: "这是内容222",
            code: 126641,
            readStatus: 1,
            readStatusName: "已读",
            publishDate: "2020-08-06 10:22:56"
          },
          {
            id: "cvb3trgd1aa",
            title: "这个是标题333",
            publisher: "admin",
            receiver: "APP",
            content: "这是内容333",
            code: 1104608,
            readStatus: 0,
            readStatusName: "未读",
            publishDate: "2020-08-06 10:22:56"
          },
          {
            id: "g4t5gdg179yhjm",
            title: "这个是标题444",
            publisher: "admin",
            receiver: "APP",
            content: "这是内容444",
            code: 1104608,
            readStatus: 0,
            readStatusName: "未读",
            publishDate: "2020-08-06 10:22:56"
          },
          {
            id: "gnjfm547uyfg",
            title: "这个是标题555",
            publisher: "admin",
            receiver: "Jack",
            content: "这是内容555",
            code: 1104608,
            readStatus: 1,
            readStatusName: "已读",
            publishDate: "2020-08-06 10:22:56"
          },
          {
            id: "jhgkm57uyj087oop",
            title: "这个是标题777",
            publisher: "admin",
            receiver: "Mary",
            content: "这是内容777",
            code: 1104608,
            readStatus: 1,
            readStatusName: "已读",
            publishDate: "2020-09-26 18:22:47"
          },
          {
            id: "DG233RH0VSNds1",
            title: "这个是标题777",
            publisher: "admin",
            receiver: "Mary",
            content: "这是内容777",
            code: 12675683,
            readStatus: 0,
            readStatusName: "未读",
            publishDate: "2020-09-27 12:01:22"
          }
        ],
        total: 7
      }
    }
  },
  {
    url: "/mock/api/message/send",
    type: "post",
    response: res => {
      return {
        type: "success",
        msg: "信息发送成功"
      }
    }
  },
  {
    url: "/mock/api/template/list",
    type: "get",
    response: res => {
      return {
        type: "success",
        msg: "成功",
        data: [
          {
            messageType: "绑定手机号",
            id: "jih21907u332hdw",
            replyContent: "骨干发链接d却无法口街道办是储蓄卡可是送不与拉斯给大家考虑过sad好几个"
          },
          {
            messageType: "修改登录密码",
            id: "124ugrbfdnh436",
            replyContent: "对符合岗位规范和个百分点的人数皮肤还不忘领略到被威锋网v的鼠标覆盖"
          },
          {
            messageType: "修改老年卡密码",
            id: "AWQRFHNV81241AS",
            replyContent: "内容有任何感受到·符合法定传绯闻1烦得很让他该返回入党深V覆盖DVD我"
          },
          {
            messageType: "登录验证码",
            id: "574fdskh2",
            replyContent: "再续贷方金额郭德纲金额唐人街与尼泊尔闪电发货皮肤很不服气共和国罚你出"
          },
          {
            messageType: "修改手机号",
            id: "nrlih34t023rgv",
            replyContent: "对酒不饮的宁波银行毒素比较难锁定父类你的饭给的是功能和把日期为图如果知道就好"
          },
          {
            messageType: "账号异地登入",
            id: "08yhbsdhjk3fr2ds",
            replyContent: "的数据发帖人和同一个违规不规范盲目跟风收费太过分三峡春冬交后台截图的深V·个电视购物"
          },
          {
            messageType: "其他设备登入",
            id: "436t8dsjhh2237",
            replyContent: "煤化工十多个不生气我发的使用与偶以为胡桃日记高难本他发个很多感悟】你特务从"
          },
        ],
        total: 7
      }
    }
  },
  {
    url: "/mock/api/system-remind/list",
    type: "get",
    response: res => {
      return {
        type: "success",
        msg: "成功",
        data: [
          {
            id: "aslhdj2438yefd80hi",
            sendAccount: "15645509095",
            sendDate: "2020-08-22 15:23",
            messageType: "绑定手机号",
            content: "sjakgj1rgfds7ubfs风刀霜剑开个会撒低功耗加工费歌"
          },
          {
            id: "gjfh35tef78",
            sendAccount: "15260699806",
            sendDate: "2020-08-22 15:23",
            messageType: "修改登录密码",
            content: "sjakgj1rgfds7ubfs风刀霜剑开个会撒低功耗加工费歌"
          },
          {
            id: "fdgj6ygdf2tyj",
            sendAccount: "13509806122",
            sendDate: "2020-08-22 15:23",
            messageType: "修改老年卡密码",
            content: "sjakgj1rgfds7ubfs风刀霜剑开个会撒低功耗加工费歌"
          },
          {
            id: "kjn23lkthrugbvs",
            sendAccount: "15645509095",
            sendDate: "2020-08-22 15:23",
            messageType: "登录验证码",
            content: "sjakgj1rgfds7ubfs风刀霜剑开个会撒低功耗加工费歌"
          },
          {
            id: "jtr42t0hsdgk98yh",
            sendAccount: "15645509095",
            sendDate: "2020-08-22 15:23",
            messageType: "修改手机号",
            content: "sjakgj1rgfds7ubfs风刀霜剑开个会撒低功耗加工费歌"
          },
          {
            id: "fhgj65yrg2jj",
            sendAccount: "15645509095",
            sendDate: "2020-08-22 15:23",
            messageType: "账号异地登入",
            content: "sjakgj1rgfds7ubfs风刀霜剑开个会撒低功耗加工费歌"
          },
          {
            id: "fdjgy9560ed",
            sendAccount: "15645509095",
            sendDate: "2020-08-22 15:23",
            messageType: "其他设备登入",
            content: "sjakgj1rgfds7ubfs风刀霜剑开个会撒低功耗加工费歌"
          }
        ],
        total: 7
      }
    }
  },
]