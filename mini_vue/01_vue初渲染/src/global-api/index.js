import { mergeOptions } from '../utils/index'

export function initGlobalApi(Vue) {
    // 用来存放全局的配置: 每个组件初始化时，都会和options选项 进行合并
    Vue.options = {}; 
    
    Vue.mixin = function(mixin) {
        this.options = mergeOptions(this.options, mixin); 
        return this;
    }

    // test
    // Vue.mixin({a:1, beforeCreate() {console.log('mixin1')}  })
    // Vue.mixin({b:2, beforeCreate() {console.log('mixin2')}  })
    // console.log('deee', Vue.options)
}