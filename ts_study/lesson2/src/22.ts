//unknown 是any的安全类型
//unknown和 any对比学习
//any 我们可以对any进行任何操作,而不需要检查类型
let value:any;
value= true;
value = 1;
value = [];

value.foo()
value.length;
//unknown

let value2:unknown;
value2 = true;
value2 = 1;
value2 = [];


//如果想调用unknown上的方法和属性

value2 = 'hello';
// 断言
console.log((value2 as string).length);
//typeof 
if(typeof value2 == 'string'){
    console.log(value2.length);
}

//联合类型中的unknown 不管跟谁联系,最后都是unknown
type U1 = unknown|null;
type U2 = unknown|undefined;
type U3 = unknown|string;
type U4 = unknown|number[];

//交叉类型
interface A{name:string,c:number}
interface B{age:number,c:number}
let a:A;
let b:B;
type C = A&B;
let c:C = {name:'zhufeng',age:10,c:10};
a=c;
b=c;

type AA = string|number;
type BB = string|boolean;
type CC = AA&BB;
//子类型 

//never是unknown子类型
type isNever = never extends unknown?true:false;
type keys = keyof unknown;

let aa:unknown
let bb:unknown;
console.log(aa ===bb);
console.log(aa !== bb);
//aa+bb;
//映射属性的时候
type getType<T> = {
    [P in keyof T]:number
}
type t = getType<unknown>

