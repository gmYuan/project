import { pushTarget, popTarget } from './dep'
import {queueWatcher} from './scheduler'


let id = 0

class Watcher {
    constructor (vm, expOrFn, cb,options) {
        this.vm = vm
        this.cb = cb
        this.options = options
        // 每个Watcher都有一个id
        this.id = ++id
        // dep相关
        this.deps = []
        this.depIds = new Set()

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
        queueWatcher(this) 
    }

    run() {
        this.get()
    }

    addDep (dep) {
        const id = dep.id
        if (!this.depIds.has(id)) {
          this.depIds.add(id)
          this.deps.push(dep)
          dep.addSub(this)
        }
    }
}





export default Watcher