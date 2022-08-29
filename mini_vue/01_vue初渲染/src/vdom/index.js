export function createElement(vm, tag, data = {}, ...children) {
    let key = data.key
    // key不属于data，而是一个单独的vdom属性
    if (key) {
        delete data.key
    }
    return vnode(vm, tag, data, key, children, undefined);
}

export function createTextNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode(vm, tag, data, key, children, text) {
    return {
        vm,
        tag,
        data,
        key,
        children,
        text,
        // .....
    }
}