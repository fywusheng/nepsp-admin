export default [
  {
    url: "/mock/api/operation/get",
    type: "get",
    response: () => {
      return {
        status: "success",
        msg: "成功",
        "data|8-20": [
          {
            "id|35000-38000": 350888,
            name: "@cname()",
            "age|60-80": 68,
            "gender|1": ["男", "女"],
            certificate: "",
            "account|1-100": 1
          }
        ]
      };
    }
  },
  {
    url: "/mock/api/content/get",
    type: "get",
    response: () => {
      return {
        status: "success",
        msg: "成功",
        "data|8-20": [
          {
            "id|1-100": 1,
            title: "@title",
            "readNum|5000-8000": 6800,
            "comments|100-300": 200,
            program: "",
            "type|1": ["图文", "普通", "视频"],
            date: "@dateTime",
            recommend: "@boolean",
            contentTitle: "@ctitle"
          }
        ]
      };
    }
  },
  {
    url: "/mock/api/version/get",
    type: "get",
    response: () => {
      return {
        status: "success",
        msg: "成功",
        "data|8-20": [
          {
            "id|1-100": 1,
            "version|1.00-2": 1,
            "system|1": ["苹果", "安卓"],
            "size|20-50": 20,
            "updateStatus|1": ["推荐下载", "独自发布"],
            "updateContent|1": ["第一版本上线", "第二版本上线"],
            "publisher|1": ["admin", "kev"],
            "releaseStatus|1": ["发布", "暂存"],
            date: "@date(yyyy-MM-dd)",
            url: "@url"
          }
        ]
      };
    }
  },
  {
    url: "/mock/api/column/get",
    type: "get",
    response: () => {
      return {
        status: "success",
        msg: "成功",
        "data|8-20": [
          {
            "id|1-100": 1,
            columnName: "@title",
            "contentNum|100-250": 200,
            realmName: "@url"
          }
        ]
      };
    }
  },
  {
    url: "/mock/api/start/get",
    type: "get",
    response: () => {
      return {
        status: "success",
        msg: "成功",
        "data|8-20": [
          {
            "id|1-100": 1,
            "version|1.00-2": 1,
            "size|20-50": 20,
            "updateContent|1": ["第一版本上线", "第二版本上线"],
            "publisher|1": ["admin", "kev"],
            "releaseStatus|1": ["已发布", "未发布", "已上线"],
            date: "@date(yyyy-MM-dd)",
            "tentativeStay|1": ["一个月", "一周", "长期有效", "一天"],
            "actualStay|1-30": 1,
            url:
              "blob:http://localhost:9082/ecff7a49-0f1c-4fef-99b6-a2218a3a5237"
          }
        ]
      };
    }
  },
  {
    url: "/mock/api/serviceType/get",
    type: "get",
    response: () => {
      return {
        status: "success",
        msg: "成功",
        "data|8-20": [
          {
            "id|1-100": 1,
            "serviceTypeName|1": [
              "健康医疗",
              "养老服务",
              "文化旅游",
              "便捷出行"
            ],
            "used|1": ["启用", "禁用"],
            publishDate: "@date(yyyy-MM-dd)",
            serviceTypeDesc: "@ctitle"
          }
        ]
      };
    }
  },
  {
    url: "/mock/api/bannerManage/get",
    type: "get",
    response: () => {
      return {
        status: "success",
        msg: "成功",
        "data|8-20": [
          {
            "id|1-100": 1,
            "size|2-10": 20,
            "bannerName|1": ["上线宣传页banner", "第二版本上线"],
            "publisher|1": ["admin", "kev"],
            "releaseStatus|1": ["已发布", "未发布", "已上线"],
            date: "@date(yyyy-MM-dd)",
            "tentativeStay|1": ["一个月", "一周", "长期有效", "一天"],
            "actualStay|1-30": 1,
            url:
              "blob:http://localhost:9082/ecff7a49-0f1c-4fef-99b6-a2218a3a5237"
          }
        ]
      };
    }
  },
  {
    url: "/mock/api/specialCategory/get",
    type: "get",
    response: () => {
      return {
        status: "success",
        msg: "成功",
        "data|8-20": [
          {
            "id|1-100": 1,
            "size|2-10": 20,
            "specialName|1": ["健康医疗", "养老服务", "文化旅游", "便捷出行"],
            order: "",
            "origin|1": ["福建厦门", "山西太原", "已上线"],
            date: "@date(yyyy-MM-dd)",
            "tentativeStay|1": ["一个月", "一周", "长期有效", "一天"],
            "pageViewNum|5000-7000": 1,
            url:
              "blob:http://localhost:9082/ecff7a49-0f1c-4fef-99b6-a2218a3a5237",
            "used|1": ["启用", "禁用"]
          }
        ]
      };
    }
  },
  {
    url: "/mock/api/service/list",
    type: "get",
    response: () => {
      return {
        status: "success",
        msg: "成功",
        data: [
          {
            serviceTitle: "这是1名称",
            serviceType: "类型1",
            serviceCode: "代码1",
            requestMethod: "请求方法1",
            serviceStatus: 2,
            serviceStatusName: "暂存",
            requestType: "请求类型1",
            detail: "这是详情111",
            creator: "creator1",
            creatAmt: "2020-09-29 12:30:56",
            props: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ],
            params: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ]
          },
          {
            serviceTitle: "这是2名称",
            serviceType: "类型2",
            serviceCode: "代码2",
            serviceStatus: 1,
            serviceStatusName: "开启",
            requestMethod: "请求方法2",
            requestType: "请求类型2",
            detail: "这是详情222",
            creator: "creator2",
            creatAmt: "2020-09-29 12:30:56",
            props: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ],
            params: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ]
          },
          {
            serviceTitle: "这是3名称",
            serviceType: "类型3",
            serviceCode: "代码3",
            requestMethod: "请求方法3",
            requestType: "请求类型3",
            serviceStatus: 1,
            serviceStatusName: "开启",
            detail: "这是详情333",
            creator: "creator3",
            creatAmt: "2020-09-29 12:30:56",
            props: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ],
            params: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ]
          },
          {
            serviceTitle: "这是4名称",
            serviceType: "类型4",
            serviceCode: "代码4",
            requestMethod: "请求方法4",
            requestType: "请求类型4",
            detail: "这是详情444",
            serviceStatus: 3,
            serviceStatusName: "禁用",
            creator: "creator4",
            creatAmt: "2020-09-29 12:30:56",
            props: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ],
            params: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ]
          },
          {
            serviceTitle: "这是5名称",
            serviceType: "类型5",
            serviceCode: "代码5",
            requestMethod: "请求方法5",
            requestType: "请求类型5",
            serviceStatus: 1,
            serviceStatusName: "开启",
            detail: "这是详情555",
            creator: "creator5",
            creatAmt: "2020-09-29 12:30:56",
            props: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ],
            params: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ]
          },
          {
            serviceTitle: "这是6名称",
            serviceType: "类型6",
            serviceCode: "代码6",
            requestMethod: "请求方法6",
            requestType: "请求类型6",
            serviceStatus: 3,
            serviceStatusName: "禁用",
            detail: "这是详情666",
            creator: "creator6",
            creatAmt: "2020-09-29 12:30:56",
            props: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ],
            params: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ]
          },
          {
            serviceTitle: "这是7名称",
            serviceType: "类型7",
            serviceCode: "代码7",
            requestMethod: "请求方法7",
            requestType: "请求类型7",
            serviceStatus: 1,
            serviceStatusName: "开启",
            detail: "这是详情777",
            creator: "creator7",
            creatAmt: "2020-09-29 12:30:56",
            props: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ],
            params: [
              {
                title: "age",
                type: "char",
                require: true,
                desc: "年龄",
                example: 20
              }
            ]
          }
        ],
        total: 7
      };
    }
  },
  {
    url: "/mock/api/serviceManage/get",
    type: "get",
    response: () => {
      return {
        status: "success",
        msg: "成功",
        "data|8-20": [
          {
            "id|1-100": 1,
            "serveCode|350000-380000": 20,
            "serveType|1": ["健康医疗", "养老服务", "文化旅游", "便捷出行"],
            "requestMethod|1": ["GET请求", "POST请求"],
            "requestType|1": ["JSON"],
            serveName: "@ctitle",
            serveDescribe: "@ctitle",
            createTime: "@date(yyyy-MM-dd)",
            creator: "@cname()",
            parameterTypeOptions: [
              { dicCode: "0", dicCodeName: "int" },
              { dicCode: "2", dicCodeName: "object" },
              { dicCode: "3", dicCodeName: "array" },
              { dicCode: "4", dicCodeName: "number" }
            ],
            paramData: {
              reqtInptpara: [
                {
                  desc: "desc",
                  example: "example",
                  paramName: "paramName",
                  paramType: "String",
                  required: true
                }
              ],
              reqtOutpara: [
                {
                  desc: "descOut",
                  example: "exampleOut",
                  paramName: "paramName",
                  paramType: "String",
                  required: false
                }
              ]
            }
          }
        ]
      };
    }
  },
  {
    url: "/mock/api/feedbackManage/get",
    type: "get",
    response: () => {
      return {
        status: "success",
        msg: "成功",
        "data|8-20": [
          {
            "id|1-100": 1,
            "feedbackContent|1": ["文字+图片"],
            "contactInfo|10000-20000": 1,
            feedbackTime: "@date(yyyy-MM-dd)",
            userName: "@cname()",
            "feedbackStatus|1": ["待回复", "未回复", "已回复"]
          }
        ]
      };
    }
  }
];
