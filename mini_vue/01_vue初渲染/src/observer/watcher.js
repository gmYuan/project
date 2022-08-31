import { pushTarget, popTarget } from './dep'


let id = 0

class Watcher {
    constructor (vm, expOrFn, cb,options) {
        this.vm = vm
        this.cb = cb
        this.options = options
        // 每个Watcher都有一个id
        this.id = ++id
        // 设置getter
        this.getter = expOrFn
        // 调用get
        this.get()
    }

    get() {
        pushTarget(this)
        this.getter()
        popTarget()
    }

    update() {
        this.get()
    }
}

export default Watcher