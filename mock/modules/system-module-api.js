export default [
  {
      url: '/mock/api/system/userCenter/getUserList',
      type: 'post',
      response: _ => {
          return {
              code: "200",
              status: 'success',
              msg: '成功',
              data: [
                  {
                      acct: '这个是标题111',
                      acctId: 'APP',
                      crteAcct: '这是内容11111',
                      status: 1,
                      crteTime: '2020-09-20'
                  },
                  {
                      acct: '这个是标题222',
                      acctId: '小程序',
                      crteAcct: '这是内容222',
                      status: 1,
                      crteTime: '2020-09-20'
                  },
                  {
                      acct: '这个是标题333',
                      acctId: 'APP',
                      crteAcct: '这是内容333',
                      status: 1,
                      crteTime: '2020-09-20'
                  },
                  {
                      acct: '这个是标题444',
                      acctId: '小程序',
                      crteAcct: '这是内容444',
                      status: 1,
                      crteTime: '2020-09-20'
                  },
                  {
                      acct: '这个是标题555',
                      publishType: 3,
                      acctId: 'H5',
                      crteAcct: '这是内容555',
                      status: 0,
                      crteTime: '2020-09-30'
                  },
                  {
                      acct: '这个是标题666',
                      publishType: 1,
                      acctId: 'APP',
                      crteAcct: '这是内容666',
                      status: 0,
                      crteTime: '2020-09-30'
                  },
                  {
                      acct: '这个是标题777',
                      acctId: '小程序',
                      crteAcct: '这是内容777',
                      status: 1,
                      crteTime: '2020-09-20'
                  }
              ],
              total: 7,
              pageNo: 1
          }
      }
  },
  {
    url: '/mock/api/system/roleCenter/getRoleList',
    type: 'post',
    response: _ => {
        return {
            code: "200",
            status: 'success',
            msg: '成功',
            data: [
                {
                    crterName: '这个是标题111',
                    roleName: 'APP',
                    crteAcct: '这是内容11111',
                    roleStas: 1,
                    crterTime: '2020-09-20'
                },
                {
                    crterName: '这个是标题222',
                    roleName: '小程序',
                    crteAcct: '这是内容222',
                    roleStas: 1,
                    crterTime: '2020-09-20'
                },
                {
                    crterName: '这个是标题333',
                    roleName: 'APP',
                    crteAcct: '这是内容333',
                    roleStas: 1,
                    crterTime: '2020-09-20'
                },
                {
                    crterName: '这个是标题444',
                    roleName: '小程序',
                    crteAcct: '这是内容444',
                    roleStas: 1,
                    crterTime: '2020-09-20'
                },
                {
                    crterName: '这个是标题555',
                    publishType: 3,
                    roleName: 'H5',
                    crteAcct: '这是内容555',
                    roleStas: 0,
                    crterTime: '2020-09-30'
                },
                {
                    crterName: '这个是标题666',
                    publishType: 1,
                    roleName: 'APP',
                    crteAcct: '这是内容666',
                    roleStas: 0,
                    crterTime: '2020-09-30'
                },
                {
                    crterName: '这个是标题777',
                    roleName: '小程序',
                    crteAcct: '这是内容777',
                    roleStas: 1,
                    crterTime: '2020-09-20'
                }
            ],
            total: 7,
            pageNo: 1
        }
    }
  }
]