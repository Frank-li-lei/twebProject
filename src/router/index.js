import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (store.state.userinfo.token) {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  },
  // 发布文章
  {
    path: '/add-article',
    name: 'AddArticle',
    component: () => import('../views/AddArticle.vue'),
    beforeEnter: (to, from, next) => {
      if (store.state.userinfo.token) {
        next()
      } else {
        next('/login')
      }
    }
  },
  // 文章列表
  {
    path: '/article-list',
    name: 'ArticleList',
    component: () => import('../views/ArticleList.vue'),
    beforeEnter: (to, from, next) => {
      if (store.state.userinfo.token) {
        next()
      } else {
        next('/login')
      }
    }
  },
  // 文章内容页
  {
    path: '/article',
    name: 'Article',
    component: () => import('../views/Article.vue'),
    beforeEnter: (to, from, next) => {
      if (store.state.userinfo.token) {
        next()
      } else {
        next('/login')
      }
    }
  },
  // 用户管理
  {
    path: '/user-perm',
    name: 'UserPerm',
    component: () => import('../views/UserPerm.vue'),
    beforeEnter: (to, from, next) => {
      if (store.state.userinfo.token) {
        // 判断用户权限
        let checkInfo = {
          contentType: 'auth_user',
          permissions: ['add', 'change', 'delete', 'view']
        }
        store.dispatch('checkUserPerm', checkInfo).then((res) => {
          if (res) {
            next()
          }
        })
      } else {
        next('/login')
      }
    }
  },
  // 栏目管理
  {
    path: '/lanmu-admin',
    name: 'LanmuAdmin',
    component: () => import('../views/LanmuAdmin.vue'),
    beforeEnter: (to, from, next) => {
      if (store.state.userinfo.token) {
        // 判断用户权限
        let checkInfo = {
          contentType: 'blog_lanmu',
          permissions: ['add', 'change', 'delete', 'view']
        }
        store.dispatch('checkUserPerm', checkInfo).then((res) => {
          if (res) {
            next()
          }
        })
      } else {
        next('/login')
      }
    }
  },
]

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes
})

export default router
