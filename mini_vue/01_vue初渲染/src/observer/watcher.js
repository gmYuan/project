class Watcher {
    constructor (vm, expOrFn, cb,options) {
        this.vm = vm
        this.cb = cb
        this.options = options
        // 设置getter
        this.getter = expOrFn
        // 调用get
        this.get()
    }

    get() {
        this.getter()
    }
}

export default Watcher