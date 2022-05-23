/****
 * 【AsyncParallelHook的实现步骤】
 * S1 继承Hook，实现compile方法
 *
 *【 Hook.js】
 * S2 this.callAsync = CALL_ASYNC_DELEGATE ==> 技巧1：惰性函数
 *
 * S3 hook.tapAsync ==> hook._tap(type, options, fn)
 *   - tapInfo =  { ...options, type, fn };
 *   - hook._insert(tapInfo)
 *
 * S4 hook._insert(tapInfo) ==> this.taps[i] = tapInfo
 *
 * S5 hook.callAsync ==> CALL_ASYNC_DELEGATE()：通过_createCall真正赋值 this.call
 *   _createCall ==>  hook.compile：父类是抽象类，由（子类）实例实现
 *
 *
 * 【HookCodeFactory.js】
 * S6 fact.setUp ==> 映射出来一个回调函数的数组 + 赋给 hooks实例的_x属性
 *
 * S7 factory.create ==> 根据options.type 分发调用
 *   - sync：
 *               this.args: 获取形参名称
 *               this.header：获取 hook._x属性
 *               this.content(cb)：属于SyncHookCodeFactory实例
 *
 *   - async：更强大的 this.args / this.header /  this.content
 *
 *
 * S8 AsyncParallelHookCodeFactory的 this.content(cb)
 *   - this.callTapsParallel({ onDone }) ==> callTapsParallel属于 HookCodeFactory
 *
 * S9 callTapsParallel
 *   - 根据 taps的数量，调用callTap
 *   - callTap：按次执行tap回调
 *
 */

let Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    //并行
    return this.callTapsParallel({ onDone });
  }
}
let factory = new AsyncParallelHookCodeFactory();

// 定义hook
class AsyncParallelHook extends Hook {
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = AsyncParallelHook;
/**
(function anonymous(name, age, _callback) {
    var _x = this._x;
    var _counter = 3;//计数器3个回调函数，或者说3个任务
    var _done = function () {
        _callback();
    };

    var _fn0 = _x[0];
    _fn0(name, age, function () {
        if (--_counter === 0) _done();
    });

    var _fn1 = _x[1];
    _fn1(name, age, function (_err1) {
        if (--_counter === 0) _done();
    });

    var _fn2 = _x[2];
    _fn2(name, age, function (_err2) {
        if (--_counter === 0) _done();
    });
});
 */
