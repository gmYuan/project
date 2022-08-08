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