import {initMixin} from './mixin'
import { ASSET_TYPES } from '../shared/constants'
import {initExtend} from './extend'
import {initAssetRegisters} from './assets'

export function initGlobalApi(Vue) {
    // 用来存放全局的配置: 每个组件初始化时，都会和options选项 进行合并
    Vue.options = {}; 
    
    initMixin(Vue)

    ASSET_TYPES.forEach(type => {
        Vue.options[type + 's'] = {}
    })

    Vue.options._base = Vue

    initExtend(Vue)
    initAssetRegisters(Vue)
 
}