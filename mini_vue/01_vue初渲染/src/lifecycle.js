import { patch } from "./vdom/patch";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
  };
}

export function mountComponent(vm, el) {
  // 更新函数: 数据变化后, 会再次调用此函数
  let updateComponent = () => {
    // vm._render: 生成虚拟dom
    // vm._update: 用虚拟dom 生成真实dom
      vm._update(vm._render());
  }
  // 渲染watcher, 每个组件都有一个watcher
  new Watcher(vm, updateComponent, () => {}, true)
}
