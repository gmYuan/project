import { updateQueue } from './component';

/***
 * React中的事件绑定，都被绑定到了document对象上  事件委托
 * 为什么要引入合成事件：
 * 1. 合成事件可以兼容浏览器差异，不同浏览器绑定和触发事件的语法不一样
 * 2. 合成事件可以实现事件对象的 复用重用，减少垃圾回收，提高性能
 * 3. 为了支持实现 setState的 批量更新
 */
export function addEvent(dom, eventType, listener) {
    eventType = eventType.toLowerCase();  // onClick ==> onclick
    // 在要绑定的dom节点上绑定一个对象，准备存放监听函数
    let eventStore = dom.eventStore || (dom.eventStore = {})

    eventStore[eventType] = listener;  //eventStore.onclick=listener  addEventListener
    document.addEventListener(eventType.slice(2), dispatchEvent, false);
}

let syntheticEvent;

function dispatchEvent(event) {
    let { type, target } = event;
    let eventType = 'on' + type;  // onclick

    // 生成全局的 合成事件对象
    syntheticEvent = getSyntheticEvent(event);

    //在事件监听函数执行前先进入批量更新模式
    updateQueue.isPending = true;

    // 模拟事件冒泡
    while (target) {
        let { eventStore } = target;
        //找的是 事件触发对象和 它的上级对象绑过的事件
        let listener = eventStore && eventStore[eventType];
        if (listener) {
            listener.call(target, syntheticEvent);
        }
        target = target.parentNode;
    }
    
    //等所有事件回掉执行完后，默认会 清除掉合成对象属性
    for (let key in syntheticEvent) {
        if (syntheticEvent.hasOwnProperty(key))
            delete syntheticEvent[key];
    }

    //当事件处理函数执行完成后，把批量更新模式改为false
    updateQueue.isPending = false;
    //执行批量更新，就是把缓存的那个updater全部执行了
    updateQueue.batchUpdate();
}

function getSyntheticEvent(nativeEvent) {
    if (!syntheticEvent) {
        persist();
    }
    syntheticEvent.nativeEvent = nativeEvent;
    syntheticEvent.currentTarget = nativeEvent.target;
    // 把原生事件对象上的属性和方法，都拷贝到 合成对象上
    for (let key in nativeEvent) {
        if (typeof nativeEvent[key] == 'function') {
            syntheticEvent[key] = nativeEvent[key].bind(nativeEvent);
        } else {
            syntheticEvent[key] = nativeEvent[key];
        }
    }
    return syntheticEvent;
}


function persist() {
    syntheticEvent = {};
    Object.setPrototypeOf(syntheticEvent, {
        persist
    });
}
