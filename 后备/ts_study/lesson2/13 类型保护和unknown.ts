/**
 * 通过一些关键字typeof instanceof for in 来缩小类型判断范围
 */
export {}

// 例1 typeof保护
function double(input:string|number){
   if(typeof input === 'string'){
       console.log(input);
   }else if (typeof input === "number") {
        console.log(input);
    }
}


// 例2 instanceof保护
class Animal{}
class Bird extends Animal{}
class Dog extends Animal {}
function getName(animal: Animal) {
    if (animal instanceof Bird) {
      console.log(animal);
    } else if (animal instanceof Dog) {
      console.log(animal);
   }
}


// 例3 null保护
function getFirstLetter(s:string|null){
    /* if(s === null){
        return '';
    } */
    //s = s||'';
   return s!.charAt(0);;
}


// 例4 链判断运算符
let a = {b:2}
let result = a?.b;
// a===null?undefined:a.b;
let x = 'b';
a?.[x];
a?.[x]()


// 例5 可辨识的联合类型
// 例5.1
interface WarningButton{
    class:'waring',
    text1:'修改'
}
interface DangerButton{
    class:'danger',
    text2:'删除'
}
type Button = WarningButton|DangerButton;
function getButton(button: Button) {
    if(button.class=== 'waring'){
        console.log(button);
    }
     if (button.class === "danger") {
       console.log(button);
     }
}

// 例5.2
interface User{
    username:string
}

type Action = { type:'add',payload:User } | {type:'delete',payload:number} 
const reducer = (action: Action) => {
    switch(action.type){
        case 'add':
            action.payload.username;
            break;
        case 'delete':
            let id:number = action.payload;
            break;
    }
};

// 例5.3
interface Bird{
    swing:number
}
interface Dog{
    leg:number;
}
function getNumber(x:Bird|Dog){
   if('swing' in x){
        console.log(x);
   }else{
       console.log(x);
   }
}


// 例6自定义的类型保护
namespace g {
    interface Bird {
        swing: number;  //2
    }
    interface Dog {
        leg: number;//4
    }
      
    //类型谓词 parameterName is Type 哪个参数是什么类型
    function isBird(y:Bird|Dog):y is Bird{
        return (y as Bird).swing == 2;
    }
    function getAnimal(x: Bird | Dog) {
        if(isBird(x)){
            console.log(x);
        }else{
            console.log(x);
        }
     }
}


//例6.1 unknown 是any的安全类型
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
value2.foo()  // 报错

//如果想调用unknown上的方法和属性
value2 = 'hello';
// 方法1: 断言
console.log((value2 as string).length);
// 方法2: typeof 
if(typeof value2 == 'string'){
    console.log(value2.length);
}

//例6.2 联合类型中的unknown 不管跟谁联系,最后都是unknown
type U1 = unknown|null;
type U2 = unknown|undefined;
type U3 = unknown|string;
type U4 = unknown|number[];


//例6.3 交叉类型：是交叉对象 A和B的子类型（同时满足既能给A，又能给B）
interface A{name:string,c:number}
interface B{age:number,c:number}
let a1:A;
let b1:B;
type C = A&B;
let c:C = {name:'zhufeng',age:10,c:10};
a1=c;
b1=c;
//子类型 
type AA = string|number;
type BB = string|boolean;
type CC = AA&BB;


//例6.4  never是unknown子类型
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


