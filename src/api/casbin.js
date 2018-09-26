import axios from '@/libs/api.request'

export const getPermissionList = (data) => {
  return axios.request({
    url: '/casbin/permission/list',
    method: 'get',
    params: data
  })
}

export const postPermissionAdd = (data) => {
  return axios.request({
    url: '/casbin/permission/add',
    method: 'post',
    data
  })
}

export const postPermissionDel = (data) => {
  return axios.request({
    url: '/casbin/permission/del',
    method: 'post',
    data
  })
}

export const getRoleList = (data) => {
  return axios.request({
    url: '/casbin/role/list',
    method: 'get'
    // params:data
  })
}

export const getRolePermissionList = (data) => {
  return axios.request({
    url: '/casbin/role/permission/list',
    method: 'get',
    params: data
  })
}

export const postRolePermissionAdd = (data) => {
  return axios.request({
    url: '/casbin/role/permission/add',
    method: 'post',
    data
  })
}
