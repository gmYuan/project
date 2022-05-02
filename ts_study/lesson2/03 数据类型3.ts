
//10 类型推导
let name
name = 1
name = 'haha'

//11 包装对象
let ex11 = 'haha'
ex11.toUpperCase()  // ==> new String(ex11).toUpperCase()


//12 联合类型
let name3 : string | number;
console.log(name3!.toString());  // 未赋值之前只能访问类型间的 公有方法
name3 = 3;
console.log(name3.toFixed(2));  // 赋值之后 能访问本类型的 所有方法
name3='zhufeng';
console.log(name3!.length);


//13 类型断言
let name4:string|number;
console.log((name4! as number).toFixed(2));
console.log((name4! as string).length);
//双重断言
console.log(name4! as any as boolean)


//14.1 字面量类型
const up: 'Up'= 'Up';
const down: 'Down' = 'Down';
const left: 'Left' = 'Left';
const right: 'Right' = 'Right';
type Direction = 'Up' | 'Down' | 'Left' | 'Right';
//可实现枚举的效果
function move(direction: Direction){}
move("Down");

//14.2 类型字面量 
type Person = {
    name:string,
    age:number
}
let p1: Person={
    name:'zhufeng',
    age:10
}


// 14.3 字面量类型 和 联合类型 
type T1 = '1' | '2' | '3';
type T2 = string | number | boolean;

let t1:T1 = '1';  // 只能是字符串 1/2/3
let t2:T2 = 'hahaha';


export {}

