import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/components/index/Index'
import Manage from '@/views/Manage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    redirect: '/index',
    meta: {
      title: '首页'
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: Index,
        meta: {
          title: '首页',
          requireAuth: true, //  当前路由是否需要登录才可进入
          content: {
            description: '飞享云盘-首页'
          }
        }
      },
      {
        path: '/s/:shareBatchNum',
        name: 's',
        component: () =>
          import(/* webpackChunkName: "s" */ '@/views/ShareView.vue'),
        meta: {
          title: '查看分享',
          content: {
            description: '查看他人分享'
          }
        },
        props: true
      },
      {
        path: '/recycle',
        name: 'Recycle',
        component: () =>
          import(/* webpackChunkName: "recycle" */ '@/views/Recycle'),
        meta: {
          title: '回收站',
          requireAuth: true, //  当前路由是否需要登录才可进入
          content: {
            description: '回收站'
          }
        }
      },
      {
        path: '/share',
        name: 'Share',
        component: () =>
          import(/* webpackChunkName: "share" */ '@/views/Share'),
        meta: {
          title: '分享',
          requireAuth: true, //  当前路由是否需要登录才可进入
          content: {
            description: '分享'
          }
        }
      },
      {
        path: '/user',
        name: 'User',
        component: () =>
          import(/* webpackChunkName: "user" */ '@/views/UserCenter'),
        meta: {
          title: '个人中心',
          requireAuth: true, //  当前路由是否需要登录才可进入
          content: {
            description: '个人中心'
          }
        }
      },
      {
        path: '/tools',
        name: 'Tools',
        component: () =>
          import(/* webpackChunkName: "tools" */ '@/views/Tools'),
        meta: {
          title: '工具',
          requireAuth: true, //  当前路由是否需要登录才可进入
          content: {
            description: '工具'
          }
        },
        chilren: []
      },
      {
        path: '/clear',
        name: 'Clear',
        component: () =>
          import(
            /* webpackChunkName: "clear" */ '@/components/tool/clear/Clear'
          ),
        meta: {
          title: '文件清理',
          requireAuth: true, //  当前路由是否需要登录才可进入
          content: {
            description: '文件清理'
          }
        }
      }
    ]
  },
  {
    path: '/login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    meta: {
      title: '飞享云盘-登录',
      content: {
        description: '飞享云盘-登录'
      }
    }
  },
  {
    path: '/excel/:fileId?',
    name: 'excel',
    component: () =>
      import(
        /* webpackChunkName: "excel" */ '@/components/office/excelEditor/ExcelEditor.vue'
      ),
    meta: {
      title: 'Excel在线编辑',
      content: {
        description: 'Excel在线编辑'
      }
    }
  },
  {
    path: '/manage',
    name: 'Manage',
    component: Manage,
    meta: { title: '后台管理' },
    redirect: '/manage/files',
    children: [
      {
        path: '/manage/files',
        name: 'fileManage',
        component: () =>
          import(
            /* webpackChunkName: "fileManage" */ '@/components/manage/FileManage.vue'
          ),
        meta: {
          requireAuth: true, //  当前路由是否需要登录才可进入
          title: '文件管理'
        }
      },
      {
        path: '/manage/users',
        name: 'ManageUser',
        component: () =>
          import(
            /* webpackChunkName: "manageUser" */ '@/components/manage/UserManage.vue'
          ),
        meta: { title: '用户管理' }
      },
      {
        path: '/manage/shares',
        name: 'ManageShare',
        component: () =>
          import(
            /* webpackChunkName: "manageUser" */ '@/components/manage/ShareManage.vue'
          ),
        meta: { title: '分享管理' }
      },
      {
        path: '/manage/recycles',
        name: 'ManageRecycle',
        component: () =>
          import(
            /* webpackChunkName: "manageUser" */ '@/components/manage/RecycleManage.vue'
          ),
        meta: { title: '回收站管理' }
      }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () =>
      import(/* webpackChunkName: "admin" */ '@/views/AdminLogin'),
    meta: { title: '管理员登录页' }
  },
  {
    path: '*',
    name: 'Error_404',
    component: () =>
      import(/* webpackChunkName: "error_404" */ '@/views/404.vue'),
    meta: { title: '链接不存在' }
  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: '/pan',  // 打包配置
  mode: 'hash',
  base: process.env.NODE_ENV === 'production' ? '/pan' : process.env.BASE_URL,
  routes
})
// router.beforeEach((to, from, next) => {
//   const tokenStr = window.localStorage.getItem('token')
//   // if (!tokenStr) return next('/login')
//   if (to.matched.some((m) => m.meta.requireAuth)) {
//     if (!tokenStr) {
//       next()
//     } else {
//       console.log('token不存在,跳转到登录页')
//       // 没有登录时,跳转到登录页面
//       next({
//         path: '/login',
//         query: { redirect: to.fullPath } //  将to参数中的url传递给login页面进行操作
//       })
//     }
//   } else {
//     next()
//   }
// })
export default router
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch((err) => err)
}
