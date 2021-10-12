import { wrapToVdom } from './utils'
import { Component } from './Component'

/** 
 * S1  作用：生成如  { type: "div",  key: bb, props: { children: [xxx]  } }的 vdom对象
 * S2 参数：type 类型    config 配置对象    children  第一个儿子
 *
 **/
function createElement(type,config,children){
    let ref      //用来 获取虚拟DOM实例的
    let key     //用来 区分同一个父亲的不同儿子
    if(config){
        delete config.__source;
        delete config.__self;
        ref = config.ref;
        delete config.ref;
        key = config.key;
        delete config.key;
    }

    // 没有ref和key
    let props = {...config}   

    //如果参数大于3个，说明有多个儿子
    if(arguments.length>3) {
        //把字符串/数字类型的 节点转换成对象的形式
        props.children = Array.prototype.slice.call(arguments,2).map(wrapToVdom)
    } else {
        if(typeof children !== 'undefined') {
            props.children = wrapToVdom(children)
        }
    }
    const vdom = {
        key,
        type,
        props,
        ref
    }
    console.log('vdom是', vdom)
    return vdom
}


const React = {
    createElement,
    Component
}

export default React;