let pathToRegexp = require('path-to-regexp');
let path = '/user/detail/:id';
let url= "/user/detail/1564280733415"
let parmas = {id: "1564280733415"};
let isExact =  true;

 let paramNames = [];
let regexp = pathToRegexp(path,paramNames,{end:false});
let result = url.match(regexp);
console.log(result);
console.log(result.length);
 let [url2,...values] = result;
 console.log(url2,values)