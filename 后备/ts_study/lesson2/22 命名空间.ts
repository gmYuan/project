//S1 外部模块:  如果出现了import/export，那么这个文件就成为一个外部模块, 简称模块
export const a = 1;
export const b = 2;
const c = 3;
export default 'zhufeng'

// S1.2 在另一个模块中 必须要 导入使用
// import name, { a, b } from './xxx'
// console.log(name);
// console.log(a,b);


// S2 内部模块：命名空间
export namespace zoo {
    class Elephant{}
    export class Dog{eat(){console.log('zoo dog');}}
    // 命名空间可以嵌套，因为本质上就是一个对象
    namespace moneyArea{
        export class Money { eat() { console.log('zoo Money'); } }
    }
}
export namespace home {
    class Wife{}
    export class Dog { eat() { console.log('home dog'); } }
}
let dogOfZoo = new zoo.Dog();
dogOfZoo.eat();
let dogOfHome = new home.Dog();
dogOfHome.eat();

// S2.2 在另一个文件中 导入使用命名空间
/* 
import { zoo } from './8';
let dogOfZoo = new zoo.Dog();
dogOfZoo.eat();
*/


// S3 文件/ 模块/ 命名空间 的关系

// 不同 module的变量不会进行合并
module Table1{
    export namespace Box1{
        export const a = 1;
        export const b = 1;
    }
}
module Table2 {
    namespace Box1 {
        export const a = 2;
        export const b = 3;
        console.log(Table1.Box1.a);
    }
}

// 同名 命名空间的变量会进行合并
namespace Box1 {
    export  const a = 1;
 }
 namespace Box1 {
    export const b = 1;
 }
 console.log('nameSpace的变量合并', Box1)

/** 编译结果是
var Box1 = {};
(function (Box1) {
    Box1.a = 1;
})(Box1);
(function (Box1) {
    Box1.b = 1;
})(Box1);
*/
