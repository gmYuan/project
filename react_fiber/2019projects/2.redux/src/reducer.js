/**
纯函数 很单纯的函数
1. 相同的输入会产出相同的输入
2.不能修改作用域外变量的值
*/
let name = "珠峰";
function create(number){
  let age = 10;
  age = 20;
  return age * number;
  //return Math.random()*number;
}
console.log(create(100));
console.log(create(200));