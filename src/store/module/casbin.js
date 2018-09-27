import { getPermissionList, postPermissionDel, getRoleList, getRoleUsers, postRoleDel } from '@/api/casbin'

export default {
  state: {
    permissionlist: [],
    rolelist: [],
    roleuser: {}
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
    },
    updateRoleUser (state, list) {
      state.roleuser = list
    },
    delRoleByName (state, name) {
      let list = state.rolelist
      let idx = -1
      for (let i = 0; i < list.length; i++) {
        const info = list[i]
        if (info.role === name) {
          idx = i
        }
      }

      if (idx > -1) {
        list.splice(idx, 1)
        state.rolelist = list
      }
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
    },
    getRoleUsers ({ commit }, args) {
      return new Promise((resolve, reject) => {
        getRoleUsers(args).then(res => {
          console.log(res)
          if (res.data) {
            commit('updateRoleUser', res.data)
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    postRoleDel ({ commit }, args) {
      return new Promise((resolve, reject) => {
        postRoleDel(args).then(res => {
          console.log(res)
          if (res.data) {
            commit('delRoleByName', args.role)
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
