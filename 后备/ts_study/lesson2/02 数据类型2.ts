// 6 非空断言
let element: (HTMLElement | null) = document.getElementById('root');
element!.style.color = 'green';


// 7 never 代表不会出现的值 
// 7.1 作为不会返回的函数的 返回值类型
function error(message:string):never{
   throw new Error('报错了');//直接异常结束 了
   console.log('ok');
}

function loop():never{
  while(true){}
  console.log('ok');
}

function fn(x:number|string){
    // 类型保护
    if(typeof x === 'number'){
        console.log(x);
    } else if (typeof x === 'string'){
        console.log(x);
    }else{
        console.log(x);  //never
    }
}

//7.2 void 代表没有任何类型 
//函数没有返回值, 那么就是void类型
//strictNullChecks=false时  null可以赋值 void；true则不行
function greeting():void{
    //return null;
}

//7.3 void never 区别
// - void 可被赋值为null / undefined； never不能包含任何类型
// - 返回类型为void的函数能正常执行； 但是返回never的函数 无法正常执行


//8 Symbol  es-next
const s1 = Symbol('key');
const s2 = Symbol('key');
// console.log(s1 === s2);


//9 BigInt
const max = Number.MAX_SAFE_INTEGER; //2**53-1
console.log(max+1 ===max+2);  // true

const max2 = BigInt(Number.MAX_SAFE_INTEGER);
console.log(max2 + BigInt(1) === max2 +BigInt(2))   // false
// console.log(max2 + 1n === max2 + 2n);   

// number类型 和 bigint类型 不兼容
let foo:number;
let bar:bigint;
// foo = bar;
// bar =foo;

export {}

