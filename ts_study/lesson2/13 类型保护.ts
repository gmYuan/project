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
