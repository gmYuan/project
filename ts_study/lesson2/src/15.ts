//类型别名

type Cart<T> = {list:T[]}|T[];
let c1:Cart<string> = {list:['1']};
let c2: Cart<number> = [1,2,3]; 
// Interface  和type的区别
//能用interface实现的不要用type



