import menuData from "@/assets/data/menu-test-data"
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    menuList: menuData
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    menuList: menuData
  }
}

export default [
  // user login
  {
    url: '/mock/usc/web/acct/login',
    type: 'post',
    response: config => {
      // const { username } = config.body
      // const token = tokens[username]

      // mock error
      // if (!token) {
      //   return {
      //     code: 60204,
      //     message: 'Account and password are incorrect.'
      //   }
      // }

      return {
        code: 0,
        data: {
          accessToken: "mockToken"
        }
      }
    }
  },

  // get user info
  {
    url: '/mock/usc/api/operate/acct/getAcctByToken\.*',
    type: 'post',
    response: config => {
      // const { token } = config.query
      // const info = users[token]

      // mock error
      // if (!info) {
      //   return {
      //     code: 50008,
      //     message: 'Login failed, unable to get user details.'
      //   }
      // }

      return {
        code: 0,
        data: {
          userNknm: "小布",
          uactId: "0",
          uact: "18850285681",
          menuTree: []
        }
      }
    }
  },

  // user logout
  {
    url: '/mock/usc/web/acct/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/mock/api/data/get',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: 'kjfdhsfaldsfashll'
      }
    }
  }
]
