let r = require('./a'); // 动态引入 es6 => import()语法
setInterval(() => {
    console.log(r)
}, 1000);