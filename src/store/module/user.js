import { login, logout, getUserInfo, getUserList } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    list: []
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    updateList (state, list) {
      state.list = list
    },
    appendList (state, list) {
      state.list.push(...list)
    }
  },
  actions: {
    flushUser ({ commit }) {
      commit('setToken', '')
      commit('setAvator', '')
      commit('setUserId', 0)
      commit('setUserName', '')
      commit('setAccess', [])
    },
    // 登录
    handleLogin ({ commit }, {userName, password}) {
      userName = userName.trim()
      password = password.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          commit('setToken', res.data.token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, dispatch }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          dispatch('flushUser')
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          const data = res.data
          commit('setAvator', data.avator)
          commit('setUserName', data.name)
          commit('setUserId', data.id)
          // commit('setAccess', data.access)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 取用户列表
    getUserList ({ commit }, {query, args}) {
      return new Promise((resolve, reject) => {
        getUserList(query, args).then(res => {
          console.log(res)
          commit('updateList', res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
