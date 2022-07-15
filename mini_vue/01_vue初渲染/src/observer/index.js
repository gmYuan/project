import { isObject } from "../utils";

// 劫持对象类型
export function observe(data) {
    // 如果是对象才观测
    if (!isObject(data)) {
        return;
    }
    return new Observer(data)
}

// 对象类型的 劫持中心
class Observer {
    //S1 对对象中的所有属性 进行劫持
    // 缺点：需要递归劫持嵌套对象的属性（增加get/set）,影响性能
    // 所以 Vue3 改成了 proxy来监听
    constructor(data) { 
        this.walk(data);
    }

    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key]);
        })
    }

}

// vue2会对对象进行遍历 ==> 每个属性用defineProperty重新定义
function defineReactive(data,key,value){ 
    observe(value); // 处理对象嵌套 ==> 递归调用

    Object.defineProperty(data, key, {
        get(){
            return value
        },
        set(newV){ 
            // Todo 更新视图
            console.log('监测到值发生了变化')
            //如果赋值的是一个新对象 ，也需要对这个新对象 进行劫持
            observe(newV);
            value = newV;
        }
    })
}