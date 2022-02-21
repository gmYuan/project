let pathToRegExp = require('path-to-regexp');
let paramNames = [];
let regexp = pathToRegExp('/user/:name/:id',paramNames,{end:true});
console.log(regexp);
paramNames = paramNames.map(item=>item.name)
let url = '/user/zhufeng/10';
let result = url.match(regexp);
console.log(result);
let params = paramNames.reduce((memo,key,index)=>{
  memo[key] = result[index+1];
  return memo;
},{});
console.log(params);