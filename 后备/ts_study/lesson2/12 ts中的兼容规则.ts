export {}

// 例1: 泛型的兼容性：带入 实际传入类型之后再比较
interface Empty<T>{
    data: T
}
let x!:Empty<string>;//{data:string}
let y!: Empty<number>;//{data:number}
x=y;


// 例2 枚举的兼容性：数字和枚举 是兼容的
enum Colors{Red,Yellow}
let c:Colors;
c = Colors.Red;
c=1;

let n:number;
n=1;
n= Colors.Red;