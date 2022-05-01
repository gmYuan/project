export {}


class Animal {}
class Dog extends Animal {
  public name: string = "Dog";
}
class BlackDog extends Dog {
  public age: number = 10;
}
class WhiteDog extends Dog {
  public home: string = "北京";
}
let animal: Animal;
let dog: Dog;
let blackDog: BlackDog;
let whiteDog: WhiteDog;
type Callback = (dog: Dog) => Dog;
function exec(callback: Callback): void {}
/**
 * 参数可以传自己和自己的父类
 * 返回值可以传自己和自己的子类
 * 四种情况
 * 1.参数传子类返回值子类  y
 * 2.参数是子类返回值是父类 n
 * 3.参数是父类返回值是父类 y
 * 4.参数是父类返值是子类 y
 */
type ChildToChild = (blackDog: BlackDog) => BlackDog;
let childToChild: ChildToChild;
//exec(childToChild);//n
type ChildToParent = (blackDog: BlackDog) => Animal;
let childToParent: ChildToParent;
//exec(childToParent);//n
type ParentToParent = (animal: Animal) => Animal;
let parentToParent: ParentToParent;
//exec(parentToParent);//n
type ParentToChild = (animal: Animal) => BlackDog;
let parentToChild: ParentToChild;
exec(parentToChild);//y
//ts中其实参数是双向协变的

