import Watcher from './observer/watcher'
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
      // 既有初始化 又有更新 
      const vm = this;
      patch(vm.$el, vnode);
  };
}

export function mountComponent(vm, el) {
  const options = vm.$options
  vm.$el = el

  // 更新函数: 数据变化后, 会再次调用此函数
  //    vm._render: 通过render函数，生成虚拟dom
  //    vm._update: 用虚拟dom 生成真实dom
  let updateComponent = () => {
      vm._update(vm._render());
  }
  // 渲染watcher, 每个组件都有一个watcher
  // true表示是一个渲染过程
  new Watcher(vm, updateComponent, () => {}, true)
}
