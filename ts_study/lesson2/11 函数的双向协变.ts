
//例1 接口的兼容性
export {}
interface Animal{
    name:string;
    age:number
}
interface Person{
    name:string;
    age:number;
    gender:number
}

function getName(a:Animal):string{
  return a.name;
}
let a: Animal = {
    name:'',
    age:10
}
getName(a);
let p: Person = {
  name: "",
  age: 10,
  gender:0
};
getName(p);

// 例2 基本数据类型的兼容性 
let num:string |number;
let str:string = 'zhufeng';
num = str;

let num2:{
    toString():string
}
let str2:string = 'jiagou';
num2 = str2; 
//str2 = num2;


// 例3 类的兼容性
namespace ab{
    class Animal {name:string}
    class Bird extends Animal {age:number}
    let a: Animal;
    let b!: Bird;
    a=b;
    // b=a;
}

// 例4 函数的兼容性  ==> 比较参数 比较返回值
// 原则：一切是为了类型安全,为了使用的时候不报错

// 比较参数
type Func = (a:number,b:number)=>void;
let sum: Func;

//少二个参数也可以
function f3(): void {}
sum = f3;

function f4(a: number, b: number,c:number): void {}
sum = f4;


//比较返回值
type GetPerson = ()=>{name:string,age:number}
let getPerson: GetPerson;

function g1(){
    return {name:'zhufeng',age:10};
}
getPerson=g1;
function g2() {
  return { name: "zhufeng", age: 10,gender:0 };
}

getPerson = g2;
function g3() {
  return { name: "zhufeng" };
}
//getPerson = g3;


// 例5 函数的双向协变
// 参数类型 是逆变的，返回值类型是协变的
// 参数可以传 父类，返回值类型可以传 子类
// 即 参数逆变父类 返回值协变子类  ==> 搀你父，返鞋子

namespace g {
class Animal {}
class Dog extends Animal {
  public name: string = "Dog";
}
class BlackDog extends Dog {
  public age: number = 10;
}
class WhiteDog extends Dog {
  public home: string = "北京";
}
function exec(callback: (dog: Dog) => Dog): void {}
/**
 * 参数可以传自己和自己的父类
 * 返回值可以传自己和自己的子类
 * ==> 搀你父，返鞋子
 * 四种情况
 * 1.参数传子类返回值子类  
 * 2.参数是子类返回值是父类 
 * 3.参数是父类返回值是父类
 * 4.参数是父类返值是子类
 */
 type ChildToChild = (blackDog: BlackDog) => BlackDog;
 let childToChild!: ChildToChild;
 exec(childToChild);  //n

 type ChildToParent = (blackDog: BlackDog) => Animal;
 let childToParent!: ChildToParent;
 exec(childToParent);   //n

 type ParentToParent = (animal: Animal) => Animal;
 let parentToParent!: ParentToParent;
 exec(parentToParent);  //n

 type ParentToChild = (animal: Animal) => BlackDog;
 let parentToChild!: ParentToChild;
 exec(parentToChild);   //y
}


// 个人理解的 函数参数逆变含义 ！！！
let d: (a: any, b: any) => void
d = function() {}         // 可以传父类（因为需要的 少于  用作  提供使用的属性个数）
d = function(a, b, c) {}  // 不可以传子类（因为需要的 多于了 提供使用的属性个数）
