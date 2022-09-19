import {nextTick} from '../utils/next-tick'

let queue = []
let has = {}

export function queueWatcher (watcher) {
  const id = watcher.id
  if (has[id] == null) {
    queue.push(watcher)
    has[id] = true
    nextTick(flushSchedulerQueue)
  }
}

function flushSchedulerQueue() {
  queue.forEach(watcher => watcher.run())
  queue = []
  has = {}
}