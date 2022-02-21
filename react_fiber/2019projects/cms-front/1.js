let str='&';
let qs = require('querystring');
let query = {};
let str2 = qs.stringify(query);
console.log(str2);
let str3 = qs.parse(str);
console.log(str3)

