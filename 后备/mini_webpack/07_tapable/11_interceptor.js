const { SyncHook } = require("./tapable");
const syncHook = new SyncHook(["name", "age"]);

syncHook.intercept({
  context: true, //我需要一个上下文对象
  register: (tapInfo) => {
    //当你新注册一个回调函数的时候触发
    console.log(`我是拦截器1的reg---> ${tapInfo.name}-1注册`);
    tapInfo.register1 = "register1";
    return tapInfo;
  },
  tap: (context, tapInfo) => {
    //每个回调函数都会触发一次
    console.log(`我是拦截器1的tap--->`, context);
    if (context) {
      context.name1 = "name1";
    }
  },
  call: (context, name, age) => {
    //每个call触发，所有的回调只会总共触发一次
    console.log(`我是拦截器1的call--->`, context, name, age);
  },
});

syncHook.intercept({
  context: true, //我需要一个上下文对象
  register: (tapInfo) => {
    //当你新注册一个回调函数的时候触发
    console.log(`我是拦截器2的reg----> ${tapInfo.name}-2注册`);
    tapInfo.register2 = "register2";
    return tapInfo;
  },
  tap: (context, tapInfo) => {
    //每个回调函数都会触发一次
    console.log(`我是拦截器2的tap--->`, context);
    if (context) {
      context.name2 = "name2";
    }
  },
  call: (context, name, age) => {
    //每个call触发，所有的回调只会总共触发一次
    console.log(`我是拦截器2的call--->`, context, name, age);
  },
});
//let tapInfo = {name,context,fn,register1,register2};

syncHook.tap({ name: "tap1函数A", context: true }, (name, age) => {
  console.log(`syncHook的回调1-->`, name, age);
});
//console.log(syncHook.taps[0]);
syncHook.tap({ name: "tap2函数B", context: true }, (name, age) => {
  console.log("syncHook的回调2-->", name, age);
});

// debugger;
syncHook.call("zhufeng", 10);
// syncHook.call("jiagou", 9);
// console.log(4 + 2 + 6);

/**
 * 执行流程为
 * S1 
 * hook.tapA(cbA) ==> inter1.reg(), inter2.reg()
 * hook.tapB(cbB) ==> inter1.reg(), inter2.reg()
 * 
 * S2 
 * hook.callA() ==> 
 *   inter1.call() ==> inter2.call()
 *   inter1.tap() ==> inter2.tap() ==> cbA()
 *   inter1.tap() ==> inter2.tap() ==> cbB()
 * 
 * S3 
 *  hook.callB() ==> 流程同S2
 * 
 
打印结果为：
== inter.reg ==
 * 我是拦截器1的reg---> tap1函数A-1注册
    我是拦截器2的reg----> tap1函数A-2注册
    我是拦截器1的reg---> tap2函数B-1注册
    我是拦截器2的reg----> tap2函数B-2注册
 

== inter.call ==
 * 我是拦截器1的call---> {} zhufeng 10
    我是拦截器2的call---> {} zhufeng 10


== inter.tap ==
*  我是拦截器1的tap---> {}
    我是拦截器2的tap---> { name1: 'name1' }
    syncHook的回调1--> { name1: 'name1', name2: 'name2' } zhufeng

    我是拦截器1的tap---> { name1: 'name1', name2: 'name2' }
    我是拦截器2的tap---> { name1: 'name1', name2: 'name2' }
    syncHook的回调2--> { name1: 'name1', name2: 'name2' } zhufeng
 */
