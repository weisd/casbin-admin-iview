import axios from '@/libs/api.request'
import {parseJWT} from '@/libs/jwt'

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
    resolve({'data': parseJWT(token).payloadObj.author})
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
