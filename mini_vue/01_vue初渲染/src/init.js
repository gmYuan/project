import { initState } from "./state";
import { compileToFunctions } from "./compiler/index";
import { mountComponent, callHook } from "./lifecycle";
import { mergeOptions } from './utils/index'
import { nextTick } from './utils/next-tick'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    // 属性合并
    vm.$options = mergeOptions(vm.constructor.options,options);
    // console.log('vm.$options', vm.$options)

    // 发布生命周期钩子
    callHook(vm, 'beforeCreate')

    // S2 对初始化数据的类型进行 逻辑细分 ==> Props/ Data/ Computed等
    initState(vm);

    // 发布生命周期钩子
    callHook(vm, 'created')

    // S3 准备模板编译
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };

  // S3 编译过程
  // 把模板转化成 对应的渲染函数render ==>
  // 虚拟dom vnode: 增加额外的对象属性 && 用diff算法来 更新虚拟dom ==>
  // 生成真实dom
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    vm.$el = el;

    // 编译优先级： render方法 > template属性 > el的内容
    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        // 也没有传递template 就取el的内容作为模板
        template = el.outerHTML;
      }
      //S3.1 将模板编译成render函数
      const render = compileToFunctions(template);
      options.render = render;
    }

    // 需要挂载这个组件
    mountComponent(vm,el);
  };


  Vue.prototype.$nextTick = nextTick
}
