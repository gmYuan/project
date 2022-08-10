import { observe } from "./observer/index";
import { proxy } from './utils';

export function initState(vm) {
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethods(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }
}

function initData(vm) {
    let data = vm.$options.data;
    // 把data结果 挂载到 vue._data上
    vm._data = data = typeof data == 'function'? data.call(vm):data;

    //S3 数据劫持/响应式原理
    // Vue2: 对象==> Object.defineProperty; 数组==> 单独处理

    // 当我去vm上取属性时 ，帮我将属性的取值代理到vm._data上
    for(let key in data){
        proxy(vm,'_data',key);
    } 
    observe(data);
}

function initProps() {}

function initMethods() {}

function initComputed() {}

function initWatch() {}