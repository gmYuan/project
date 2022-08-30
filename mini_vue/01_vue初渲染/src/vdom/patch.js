export function patch(oldVnode, vnode) {
    // 判断是初次渲染还是后续更新 ==> 是否是 原生真实dom
    // 只有在 原生真实dom节点上，才存在 nodeType属性
    const isRealElement = oldVnode.nodeType;

    if (isRealElement) {
        const oldElm = oldVnode   // <div id='app'>
        const parentElm = oldElm.parentNode;
        let elm = createElm(vnode);
        // 插入真实dom
        parentElm.insertBefore(elm, oldElm.nextSibling);
        parentElm.removeChild(oldElm);
        // 返回节点
        return elm
    }
}

function createElm(vnode) {
    let { tag, data, children, key, text, vm } = vnode
    if (typeof tag === 'string') { // 元素
        // 虚拟节点会有一个el属性 对应真实节点
        vnode.el = document.createElement(tag); 
        // 更新属性
        updateProperties(vnode);
        // 递归创建子节点真实dom
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        });
    } else {  // 文本
        vnode.el = document.createTextNode(text);
    }
    return vnode.el
}

// 更新属性
function updateProperties(vnode, oldProps = {}) {
    let newProps = vnode.data || {};
    let el = vnode.el;
    //以新的为准
    for (let key in newProps) { 
        if (key === 'style') {
            for (let styleName in newProps.style) {
                // 新增样式
                el.style[styleName] = newProps.style[styleName];
            }
        } else if (key === 'class') {
            el.className = newProps.class;
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }
}