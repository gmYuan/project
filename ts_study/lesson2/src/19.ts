export {}
interface Empty<T>{
    
}
let x:Empty<string>;//{data:string}
let y: Empty<number>;//{data:number}
x=y;
//数字和枚举 是兼容的
enum Colors{Red,Yellow}
let c:Colors;
c = Colors.Red;
c=1;
let n:number;
n=1;
n= Colors.Red;

type Callback = (a:string|number)=>string|number;
function exec(callback:Callback){

}
type ChildToChild = (a: string) => string;
let childToChild: ChildToChild;
exec(childToChild);//n
type ChildToParent = (a: string) => string|number|boolean;
let childToParent: ChildToParent;
exec(childToParent);//n
type ParentToParent = (a: string|number|boolean) => string|number|boolean;
let parentToParent: ParentToParent;
exec(parentToParent);//n
type ParentToChild = (a: string|number|boolean) => string;
let parentToChild: ParentToChild;
exec(parentToChild);//y