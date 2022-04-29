let {SyncHook} = require('tapable');

class Compiler{
  constructor(options){
    this.options = options;
    this.hooks = {
      run:new SyncHook(),   //会在开始编译的时候触发
      done:new SyncHook()  //会在完成编译的时候触发
    }
  }

  //4.执行对象的run方法开始执行编译
  run(callback){
    //当调用run方法的时候会触发run这个钩子, 进而执行它的回调函数 
    this.hooks.run.call(); 
    //中间是编译过程...
    this.hooks.done.call();    
  }

}

module.exports = Compiler;