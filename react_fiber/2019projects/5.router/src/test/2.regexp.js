let str = 'acbcd';
let reg1 = /a(?!b)c/;
let result = str.match(reg1);
console.log(result);//result[0] =