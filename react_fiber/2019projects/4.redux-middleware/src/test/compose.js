function add1(str){
  return "1"+str;
}
function add2(str){
  return "2"+str;
}
function add3(str){
  return "3"+str;
}
console.log(add3(add2(add1('zhufeng'))));
//321zhufeng
function compose1(...fns){
 if(fns.length == 0)
    return args=> args;
 if(fns.length == 1){
    return (...args)=> fns[0](...args);
 }  
 //最早的实现是这样的
 return function(...args){
    let last = fns.pop();
    let value = last(...args);//1zhufeng
    // current 1zhufeng fn=add2
    return fns.reduceRight((current,fn)=>{
        return fn(current);
    },value);
 }
}
function sum(a,b){
    return a+b;
}
function compose(...funcs){
    if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
/**
reduce第一次执行 a=add3 b=add2 
第二次执行 a=上一次的返回值(...args)=>add3(add2(...args))); b=add1 =>(a,b)=>(...args)=>a(add1(...args))
 */
console.log(compose()('zhufeng'));//'zhufeng'
console.log(compose(add1)('zhufeng'));//1zhufeng
console.log(compose(add3,add2,add1,sum)(3,3));//3216

