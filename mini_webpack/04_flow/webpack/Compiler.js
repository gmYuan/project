let {SyncHook} = require('tapable');
const path = require('path');
const fs = require('fs');

//path.posix.sep /  path.sep不同操作系统的路径分隔符 ==>  \/
function toUnixPath(filePath){
  return filePath.replace(/\\/g,'/');
}
//根目录，当前工作目录
let baseDir  = toUnixPath(process.cwd());

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
    
    //5.根据配置中的entry找出入口文件,得到entry的绝对路径
    //C:\xxx\xxx\src\index.js
    //打包后的文件，所有的路径都是\ => /
    let entry = {};
    if(typeof this.options.entry === 'string'){
      entry.main=this.options.entry;
    }else {
      entry = this.options.entry;
    }
    for(let entryName in entry) {
      let entryFilePath =toUnixPath( path.join( this.options.context, entry[entryName] ) );
      //6. 从入口文件出发,调用所有配置的Loader对模块进行编译
      let entryModule =  this.buildModule(entryName, entryFilePath);
       
    }

    // 完成钩子触发
    this.hooks.done.call();    
  }

  buildModule=(name, modulePath)=>{
    //读取原始源代码
    let originalSourceCode = fs.readFileSync(modulePath,'utf8');
    let targetSourceCode=originalSourceCode;
    //查找此模块对应的loader对代码进行转换
    let rules = this.options.module.rules;
    let loaders = [];
    for(let i=0;i<rules.length;i++){
        //正则匹配上了模块的路径
        if(rules[i].test.test(modulePath)){
            loaders=[...loaders, ...rules[i].use ];
        }
    }
    //loaders=['logger1-loader.js','logger2-loader.js','logger3-loader.js','logger4-loader.js']
    for(let i=loaders.length-1;i>=0;i--){
        let loader = loaders[i];
        targetSourceCode=require(loader)(targetSourceCode);
    }
    // console.log('originalSourceCode---', originalSourceCode)
    // console.log('targetSourceCode---', targetSourceCode)
  }


}

module.exports = Compiler;