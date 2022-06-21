let a = { c: 1 };
setTimeout(() => {
    a.c = 10;
},2000)
module.exports = 'hello';


// exports = 'hello' 你改变exports 属性不会导致module.exports变化
// 最终导出的是module.exports

// exports.a = 'hello',会通过引用找到空间添加属性,导致module.exports发生变化


// 循环引用的解决方案就是不循环引用，否则只会加载部分内容