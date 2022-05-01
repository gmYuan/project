
export {}
class Father {
  father: string;
}
class Child1 extends Father {
  child1: string;
}
class Child2 extends Father {
  child1: string;
}
interface Calculate{
  <T extends (string | number)>(a:T,b:T):void
}
//'number' is assignable to the constraint of type 'T', 
//but 'T' could be instantiated with a different subtype of constraint 'number'.
//不能说只能多少 只能适用于接口或对象属性上来说才是只多不少
//严格来说就是子类型
let sum: Calculate = function <T extends (string | number)>(a: T, b: T): void {

};
/**
 * string 是(string | number)的子类型
 * (string | number)是(string|number|boolean)的子类型
 */
//sum<(string|number|boolean)>(null, null);


