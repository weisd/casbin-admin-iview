import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    account: userName,
    passwd: password
  }
  return axios.request({
    url: '/user/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return new Promise((resolve, reject) => {
    resolve({'data': {'id': 'test', 'name': 'testname', 'avatar': ''}})

    // reject(err)

    // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
    // commit('setToken', '')
    // commit('setAccess', [])
    // resolve()
  })

  // return axios.request({
  //   url: 'get_info',
  //   params: {
  //     token
  //   },
  //   method: 'get'
  // })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
