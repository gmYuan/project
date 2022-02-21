let title = require('./title');
console.log(title.default||title);
//是对象 有几个属性 
/**
有两个属性 
default: "hello"
__esModule: true
 */
 //如果说引入的是一个esmodule的话，首先它会有一个__esModule=true,
 //然后如果你要取导出对象的话就需要从default上取就可以了
