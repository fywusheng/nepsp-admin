export default [
    // user login
    {
        url: '/allUserInfo',
        type: 'get',
        response: config => {
            return {
                code: 0,
                data: [{
                    id: 1,
                    name: "王一",
                    sex: "男",
                    age: "20",
                    role: "管理员",
                }, {
                    id: 2,
                    name: "王一",
                    sex: "男",
                    age: "20",
                    role: "管理员",
                }, {
                    id: 3,
                    name: "王一",
                    sex: "男",
                    age: "20",
                    role: "管理员",
                }]
            }
        }
    },
]
