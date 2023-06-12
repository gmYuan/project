/****
 * 【syncHook的实现步骤】
 * S1 继承Hook，实现compile方法
 *
 *
 *【 Hook.js】
 * S2 this.call = CALL_DELEGATE ==> 技巧1：惰性函数
 *
 * S3 hook.tap ==> hook._tap(type, options, fn)
 *   - tapInfo =  { ...options, type, fn };
 *   - hook._insert(tapInfo)
 *
 * S4 hook._insert(tapInfo) ==> this.taps[i] = tapInfo
 *
 * S5 hook.call ==> CALL_DELEGATE()：通过_createCall真正赋值 this.call
 *   _createCall ==>  hook.compile：父类是抽象类，由（子类）实例实现
 *
 *
 * 【HookCodeFactory.js】
 * S6 fact.setUp ==> 映射出来一个回调函数的数组 + 赋给 hooks实例的_x属性
 *
 * S7 factory.create ==> 根据options.type 分发调用
 *   - sync：this.header：获取 hook._x属性
 *               this.content(cb)：属于SyncHookCodeFactory实例
 *
 *
 * S8 syncHookCodeFactory的 this.content(cb)
 *   - this.callTapsSeries({ onDone }) ==> callTapsSeries属于 HookCodeFactory
 *
 * S9 callTapsSeries
 *   - 根据 taps的数量，调用callTap
 *   - callTap：按次执行tap回调
 *
 */

let Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");
class SyncHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    return this.callTapsSeries({ onDone });
  }
}
let factory = new SyncHookCodeFactory();

// S1 继承Hook，实现compile方法
class SyncHook extends Hook {
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}
module.exports = SyncHook;
