import Vue from 'vue'
import Message from './Message.vue'
// 消息提示组件 this.$toast.success('提示信息')
const MsgClass = Vue.extend(Message)
const MsgMain = {
  show(text, type, duration) {
    // 实例化这个组件
    const instance = new MsgClass()
    // 将组件实例挂在到一个元素上面，如果不传参数就是挂载到body，或者也可以传入其他已经存在的元素的选择器
    instance.$mount(document.createElement('div'))
    // 通过组件实例的$el属性，可以访问到这个组件元素，然后把它拼接到body上。
    document.body.appendChild(instance.$el)
    // 给这个实例传入参数
    instance.type = type
    instance.content = text
    instance.show = true
    instance.duration = duration
    if (duration !== -1) {
      var id = setInterval(() => {
        instance.$el.remove()
        clearInterval(id)
      }, duration) // 类似于setTimeout，但不断调用函数(每次都有延迟)，直到它被取消。
    }
  },
  // 成功时调用这个方法
  success(text, duration) {
    this.show(text, 'success', duration === undefined ? 3000 : duration)
  },
  // 失败时调用这个方法
  error(text, duration) {
    this.show(text, 'error', duration === undefined ? 3000 : duration)
  },
  warning(text, duration) {
    this.show(text, 'warning', duration === undefined ? 3000 : duration)
  },
  // 提示时调用这个方法
  info(text, duration) {
    this.show(text, 'info', duration === undefined ? 3000 : duration)
  }
}

// 全局注册
function Toast() {
  Vue.prototype.$toast = MsgMain
  // 最终调用就是this.$toast.success()
}

export default Toast
