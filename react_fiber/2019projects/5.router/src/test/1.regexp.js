let pathToRegExp = require('path-to-regexp');
let regexp = pathToRegExp('/home',[],{end:false});
console.log(regexp);//  /^\/home(?:\/)?$/i
let reg = /^\/home(\/)?$/i;
let str = '/home/a';
console.log(str.match(regexp));
console.log(str.match(reg));