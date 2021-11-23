import { wrapToVdom } from './utils'
import { Component } from './Component'
import { REACT_FORWARD_REF_TYPE } from './constants'


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
        type,
        props,
        ref,
        key
    }
    console.log('vdom是', vdom)
    return vdom
}

/**
 * 根据一个老的元素，克隆出一个新的元素
 * @param {*} oldElement 老元素
 * @param {*} newProps 新属性
 * @param {*} children 新的儿子们
 */
 function cloneElement(oldElement,newProps,children){
    if(arguments.length>3){
        children = Array.prototype.slice.call(arguments,2).map(wrapToVdom);
    }else{
        children = wrapToVdom(children);
    }
    let props = {...oldElement.props, ...newProps, children}
    return { ...oldElement, props }
}






function createRef(){
    return {current:null};
}

/** 
function forwardRef(FunctionComponent){
  return class extends Component{
    render(){
        return FunctionComponent(this.props, this.props.ref);
    }
  }
}
*/
function forwardRef(render){
    return {
        $$typeof: REACT_FORWARD_REF_TYPE,
        render  //原来那个函数件
    }
}

function createContext(){
    function Provider({value,children}){
        Provider._value = value;
        return children;
    }
    function Consumer({children}){
       return children(Provider._value);
    }
    return {Provider,Consumer}
} 

// function createContext(){
//     let context = {$$typeof: REACT_CONTEXT};
//     context.Provider = {$$typeof: REACT_PROVIDER, _context: context};
//     context.Consumer = {$$typeof: REACT_CONTEXT, _context: context};
//     return context;
// }


const React = {
    createElement,
    cloneElement,

    Component,
    createRef,
    forwardRef,
    createContext
}

export default React;