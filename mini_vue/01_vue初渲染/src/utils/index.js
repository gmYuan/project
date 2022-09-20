import { ASSET_TYPES } from '../shared/constants'

export function isObject(val) {
    return typeof val == 'object' && val !== null
}

export function isFunction(val) {
    return typeof val === 'function';
}


export function proxy(vm,data,key){
    Object.defineProperty(vm,key,{ // vm.a
        get(){
            return vm[data][key]; // vm._data.a
        },
        set(newValue){ // vm.a = 100;
            vm[data][key] = newValue// vm._data.a = 100;
        }
    })
}


// 合并配置项，如生命周期等
let lifeCycleHooks = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
]
let strats = {}; // 存放各种策略

export function mergeOptions (parent,child) {
    const options = {}
    let key
    for (key in parent) {
        mergeField(key)
    }
    // 只有儿子中独有的，也需要加上
    for (key in child) {
        // 排除掉已经合并过的 属性
        if (!parent.hasOwnProperty(key)) {
            mergeField(key)
        }
    }

    function mergeField (key) {
         // 特殊属性: 如果有对应的策略就调用对应的策略即可
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key])
        } else {
            // 合并一般属性
            // 儿子和父亲都有，用儿子覆盖父亲的
            if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
                options[key] = { ...parent[key], ...child[key] }
                // 父亲中有，儿子中没有，取父亲中的   
            } else if (child[key] == null) {
                options[key] = parent[key]
            } else {
                options[key] = child[key]
            }
        }
    }
    
    return options
}


function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal); // 后续
        } else {
            return [childVal]; // 第一次
        }
    } else {
        return parentVal
    }
}
lifeCycleHooks.forEach(hook => {
    strats[hook] = mergeHook
});


function mergeAssets (parentVal, childVal,vm, key) {
  const res = Object.create(parentVal || null)
  if (childVal) {
    for (let key in childVal) {
        res[key] = childVal[key]
    }
  } 
  return res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})