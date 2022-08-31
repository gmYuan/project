let id = 0

export default class Dep {
  constructor () {
    this.id = id++
    this.subs = []
  }

  depend () {
    // 观测者模式
    if (Dep.target) {
      this.subs.push(Dep.target) 
    }
  }

  notify () {
    this.subs.forEach(watcher => watcher.update())
  }
}



Dep.target = null
let stack = []

export function pushTarget (watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget () {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}
