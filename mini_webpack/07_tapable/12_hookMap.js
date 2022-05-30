let { SyncHook } = require("tapable");
class HookMap {
  constructor(factory) {
    this._map = new Map();
    this._factory = factory;
  }
  get(key) {
    return this._map.get(key);
  }
  tap(key, options, fn) {
    return this.for(key).tap(options, fn);
  }
  tapAsync(key, options, fn) {
    return this.for(key).tapAsync(options, fn);
  }
  tapPromise(key, options, fn) {
    return this.for(key).tapPromise(options, fn);
  }
  for(key) {
    const hook = this.get(key);
    if (hook) return hook;
    let newHook = this._factory();
    this._map.set(key, newHook);
    return newHook;
  }
}
const keyedHookMap = new HookMap(() => new SyncHook(["name"]));
keyedHookMap.tap("key1", "plugin1", (name) => {
  console.log(1, name);
});
keyedHookMap.for("key2").tap("plugin2", (name) => {
  console.log(2, name);
});
const hook1 = keyedHookMap.get("key1");
hook1.call("zhufeng");
const hook2 = keyedHookMap.get("key2");
hook2.call("jiagou");

//webpack里面 map.for('javascript/auto')....
