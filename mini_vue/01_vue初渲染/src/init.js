import { initState } from "./state";

export function initMixin(Vue){
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;

        // S2 对初始化数据的类型进行 逻辑细分 ==> Props/ Data/ Computed等
        initState(vm);
      
    }
}