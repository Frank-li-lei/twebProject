import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import Qs from "qs";
import router from "../router"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userinfo: {}
  },
  getters: {
    // 查询登录状态
    isnotUserLogin(state) {
      return state.userinfo.token
    },
    // 查询用户名
    currentUser(state) {
      return state.userinfo.nickName
    }
  },
  mutations: {
    // 保存用户 登录注册信息
    saveUserinfo(state, userinfo) {
      state.userinfo = userinfo
    },
    // 退出登录
    clearUserinfo(state) {
      state.userinfo = {}
    }
  },
  actions: {
    // 登录
    blogLogin({ commit }, formData) {
      axios({
        url: "http://127.0.0.1:9000/api/tweb-login/",
        method: "post",
        data: Qs.stringify(formData),
      })
        .then((res) => {
          if (res.data == "none") {
            alert("用户名不存在");
            return;
          }
          if (res.data == "pwderr") {
            alert("密码错误");
            return;
          }
          console.log(res.data);
          commit('saveUserinfo', res.data)
          localStorage.setItem('token', res.data.token)
          router.push({ path: '/' })
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 注册
    blogRegister({ commit }, formData) {
      axios({
        url: "http://127.0.0.1:9000/api/tweb-register/",
        method: "post",
        data: Qs.stringify(formData),
      })
        .then((res) => {
          if (res.data == "repeat") {
            alert("用户名已存在");
            return;
          }
          console.log(res.data)
          commit('saveUserinfo', res.data)
          localStorage.setItem('token', res.data.token)
          router.push({ path: '/' })
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 自动登录
    tryAutoLogin({ commit }) {
      let token = localStorage.getItem('token')
      if (token) {
        axios({
          url: "http://127.0.0.1:9000/api/auto-login/",
          method: "post",
          data: Qs.stringify({ token })
        })
          .then(res => {
            // console.log(res.data)
            if (res.data == "tokenTimeout") {
              alert('用户信息过期，请重新登录')
              return
            }
            commit("saveUserinfo", res.data)
            // 缓存
            localStorage.setItem('token', res.data.token)
            router.push({ path: '/' })
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    // 登出
    blogLogout({ commit }, token) {
      commit('clearUserinfo')
      localStorage.removeItem('token')
      axios({
        url: "http://127.0.0.1:9000/api/tweb-logout/",
        method: "post",
        data: Qs.stringify({ token })
      }).then(res => {
        console.log(res.data)
      })
        .catch(e => {
          console.error(e)
        })
    },
    // 权限判断
    async checkUserPerm({ getters }, checkInfo) {
      // 用户
      let token = getters.isnotUserLogin
      // 表
      let contentType = checkInfo.contentType
      // 权限
      let permissions = checkInfo.permissions
      // let 鉴权结果
      let perm_data
      await axios({
        method: 'post',
        url: 'http://127.0.0.1:9000/api/tweb-checkperm/',
        data: Qs.stringify({
          token,
          contentType,
          permissions: JSON.stringify(permissions)
        })
      }).then((res) => {
        // console.log(res.data)
        if (res.data == 'nologin') {
          perm_data = false
          alert('用户登录过期')
          return
        }
        if (res.data == 'noperm') {
          perm_data = false
          alert('用户权限不足，请联系管理员')
          return
        }
        if (res.data == 'ok') {
          perm_data = true
        }
      })
      return perm_data
    }

  },
  modules: {
  }
})
