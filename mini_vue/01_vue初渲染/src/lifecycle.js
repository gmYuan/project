import Watcher from './observer/watcher'
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
      // 既有初始化 又有更新 
      const vm = this;
      vm.$el = patch(vm.$el, vnode);
  };
}

export function mountComponent(vm, el) {
  const options = vm.$options
  vm.$el = el

  // 发布生命周期钩子
  callHook(vm, 'beforeMount')

  // 更新函数: 数据变化后, 会再次调用此函数
  //    vm._render: 通过render函数，生成虚拟dom
  //    vm._update: 用虚拟dom 生成真实dom
  let updateComponent = () => {
      console.log('updateComponent进行了更新')
      vm._update(vm._render());
  }
  // 渲染watcher, 每个组件都有一个watcher
  // true表示是一个渲染过程
  new Watcher(vm, updateComponent, () => {}, true)

  // 发布生命周期钩子
  callHook(vm, 'mounted')
}


export function callHook (vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    // 找到对应的钩子依次执行
    for (var i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
 
}