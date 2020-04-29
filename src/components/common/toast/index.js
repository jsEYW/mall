import Toast from './Toast'

const obj = {}

// 默认将Vue作为参数传过来
obj.install = function(Vue) {

    // document.body.appendChild(Toast.$el) 不行

    // 创造组件构造器
    const toastContrustor = Vue.extend(Toast)
    // new的方式，根据组件构造器，创建一个组件对象
    const toast = new toastContrustor()
    // 将组件对象手动挂载到某一个元素上
    toast.$mount(document.createElement('div'))
    // toast.$el对应的就是div
    document.body.appendChild(toast.$el)

    Vue.prototype.$toast = toast
}

export default obj