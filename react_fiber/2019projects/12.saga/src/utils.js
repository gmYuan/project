const delay = ms => new Promise((resolve,reject)=>setTimeout(() => {
   // Math.random()>.5?resovle('成功'):reject('失败');
   Math.random()>.5?resolve({code:0,data:'成功'}):resolve({code:1,error:'失败'});
}, ms));
//这是一种非常典型的node风格，基于回调函数实现异步的代码
const readFile = (filename,callback)=>{
   setTimeout(() => {
       callback(null,filename);
   }, 1000);
}
export {delay,readFile};

/* readFile('1.txt',(err,data)=>{
    if(err){

    }else{

    }
}); */