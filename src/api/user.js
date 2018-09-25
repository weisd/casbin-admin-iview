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
  return Promise.resolve({'data': parseJWT(token).payloadObj.author})

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
    url: '/user/logout',
    method: 'post'
  })
}

export const getUserList = (data) => {
  return axios.request({
    url: '/user',
    method: 'get',
    params: data
  })
}

// getUserInfoByID getUserInfoByID
// params id
export const getUserInfoByID = (data) => {
  return axios.request({
    url: '/user/info',
    method: 'get',
    params: data
  })
}

export const postUserAdd = (data) => {
  return axios.request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export const postUserUpdate = (data) => {
  return axios.request({
    url: '/user/update',
    method: 'post',
    data
  })
}
