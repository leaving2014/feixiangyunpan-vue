import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import uploader from 'vue-simple-uploader'
import globalFunction from '@/libs/globalFunction.js'
import '@/router/before.js'
import * as filters from '@/filter/index.js'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import { request } from './request/request.js'
// 确认框
import confirmBox from '@/components/common/confirm/confirm.js'
// 文件目录选择框
import fileSelector from '@/components/common/fileSelector/index.js'
import '@/assets/styles/reset.css'
import '@/assets/styles/iconfont.css'
import '@/assets/styles/home.css'
import '@/assets/styles/confirm.css'
import '@/assets/styles/homemain.less'
import '@/assets/styles/index.less'
import '@/assets/styles/global.css'
/**
 * 配置cdn引入的包
 */
// import axios from 'axios'
import Cookie from 'js-cookie' // 挂载全局
// 右键菜单
import contextMenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

// 音视频播放器
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
// 图片预览
// import Viewer from 'v-viewer'
// import 'viewerjs/dist/viewer.css'
// 代码编辑器
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

// Markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 全局配置
import config from '@/config/index.js'
// 引入挂载移动文件等插件
import operateElement from '@/libs/fileOperationPlugins.js' // 引入
// 消息提示
import Toast from '@/components/common/message/index.js'

// Vue.use(ElTabs, ElForm, ElButton)
Vue.use(ElementUI)
Vue.use(Toast)

Vue.prototype.$cookie = Cookie

for (const key in globalFunction) {
  Vue.prototype[key] = globalFunction[key]
}

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.use(contextMenu)
Vue.use(uploader)
Vue.use(VuePlyr)
Vue.use(VueCodemirror)
Vue.use(mavonEditor)
// Vue.use(ElementUI)
// Viewer.setDefaults({
//   url: 'data-source', // 大图地址参数
//   filter(image) {
//     // 只有大图的才能放大
//     const dataSource = image.getAttribute('data-source')
//     if (dataSource == null || dataSource == undefined) {
//       return false
//     } else {
//       return true
//     }
//   }
// })
// Vue.use(Viewer)
Vue.use(operateElement) //  挂载自定义插件
Vue.prototype.$config = config
Vue.prototype.$confirmBox = confirmBox
Vue.prototype.$fileSelector = fileSelector
Vue.config.productionTip = false
// axios.defaults.baseURL = '/api'
Vue.prototype.$request = request
new Vue({
  beforeCreate() {
    Vue.prototype.$bus = this // 安装全局事件总线,$bus就是当前应用的vm
  },
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
