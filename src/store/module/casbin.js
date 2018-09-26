import { getPermissionList, postPermissionDel, getRoleList } from '@/api/casbin'

export default {
  state: {
    permissionlist: [],
    rolelist: []
  },
  mutations: {
    updatePermissionList (state, list) {
      state.permissionlist = list
    },
    deletePermission (state, info) {
      let idx = -1
      let list = state.permissionlist
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        if (info.name === ele.name && info.method === ele.method && info.path === ele.path && info.origin === ele.origin) {
          idx = i
        }
      }

      if (idx > -1) {
        list.splice(idx, 1)
        state.permissionlist = list
      }
    },
    updateRoleList (state, list) {
      state.rolelist = list
    }
  },
  actions: {
    getPermissionList ({ commit }, args) {
      return new Promise((resolve, reject) => {
        getPermissionList(args).then(res => {
          commit('updatePermissionList', res.data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    postPermissionDel ({ commit }, args) {
      return new Promise((resolve, reject) => {
        postPermissionDel(args).then(res => {
          if (res.data) {
            commit('deletePermission', args)
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    getRoleList ({ commit }, args) {
      return new Promise((resolve, reject) => {
        getRoleList(args).then(res => {
          console.log(res)
          if (res.data) {
            commit('updateRoleList', res.data)
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
