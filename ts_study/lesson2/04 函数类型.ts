// 例1 定义函数类型
function hello(name:string):void{
  console.log('hello',name);
}
hello('zhufeng');

type GetName = (firstName:string,lastName:string)=>string;
let getName: GetName = function (firstName: string, lastName: string): string{
    return firstName+lastName;
}


// 例2 可选参数 & 默认参数
function print(name:string,age?:number):void{
  console.log(name,age);
}
print('zhufeng',11);

function ajax(url:string,method:string='GET'){
  console.log(url,method);
}
ajax('/');


// 例3 剩余参数
function sum(...numbers:number[]){
    return numbers.reduce((val,item)=>val+item,0)
}
console.log('sum是', sum(1,2,3));


// 例4  函数的重载 
let obj:any = {};
/**
 * 如果传的val是
 *   - 字符串赋给obj.name
 *   - 数字,赋给obj.age
 * @param val 
 */
function attr(val: string): void
function attr(val: number): void
function attr(val:any):void{
    if(typeof val === 'string'){
        obj.name = val;
    } else if (typeof val === 'number'){
        obj.age = val;
    }
}
attr('zhufeng');
attr(10);
//attr(true);

// 经典例子！！！
function add(a: string,b:string): void
function add(a: number,b:number): void
function add(a: string|number,b:string|number): void {}
add('a','b');
add(1,2);
// add(1,'b');

//非常有名的案例 compose

export {}