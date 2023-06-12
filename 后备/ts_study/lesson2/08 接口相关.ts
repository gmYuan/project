export {}

/**
 * S1 接口作用
 *  S1.1 描述对象的形状
 *  S1.2 是对 行为的抽象
 * 
 * S2 接口接受任意属性
 * 
 * S3 接口的继承
 * 
 * S4 函数类型接口
 * 
 * S5 可索引接口：对数组和对象进行约束 
 * 
 * S6 类的 构造函数类型
 *   S6.1 类可以表示2种类型： 函数本身类型（构造函数）；该类的实例对象类型
 *   S6.2 类名ClassA 默认表示的是 实例对象的类型，即 a1: ClassA = new ClassA()
 *   S6.3 如果想获取函数本身的类型，可以使用 typeof ClassA，即
 *           a2: typeof  ClassA = ClassA
 * 
 * 
 *  S7 其他
 */


//S1.1 描述对象的形状
interface Speakable{
    name:string;
    speak():void
}
let speakMan: Speakable={
    name:'zhufeng',
    speak(){}
}

// S1.2 是对 行为的抽象
//同名的接口可以写多少,类型会自动合并
interface Speakable{
    speak():void
}
interface Eatable {
    eat(): void
}
class Person implements Speakable, Eatable{
    name: string
    speak() {
        throw new Error("Method not implemented.")
    }
    eat(): void {
        throw new Error("Method not implemented.")
    }
}


//S2 接口接受任意属性
interface Person2 {
    readonly id:number;
    name:string;
    [key:string]:any
}
let p: Person2={
    id:1,
    name:'zhufeng',
    age:10,
    home:'dd',
    11:11
}


// S3 接口的继承
interface Speakable2{
    speak():void
}
interface SpeakChinese extends Speakable2{
    speakChinese(): void
}
class ChineseMan implements SpeakChinese{
    speakChinese(): void {
        throw new Error("Method not implemented.")
    }
    speak() {
        throw new Error("Method not implemented.")
    }
}

interface Person3{
    readonly id:number;
}
let p3:Person3 = {
    id:1
}
//p3.id = 2;


// S4 函数类型接口
interface Discount{
   (price:number):number
}
const discount: Discount = (price: number): number=>{
    return price*.8;
}


//S5 可索引接口：对数组和对象进行约束 
interface User{
    [xx: number]:string
}
let user: User={
    0:'0',1:'1',2:'2'
}
let arr: User=['1','2','3'];


//S6 构造函数类型
//如果没有new：就是修饰普通函数 
//加上new：      用来描述类的构造函数
interface WithNameClass{
    new(name:string):any
}

class Animal{
    constructor(public name:string){
    }
}

let wc: WithNameClass = Animal

function createClass(clazz: WithNameClass,name:string){
    return new clazz(name);
}
let a = createClass(Animal,'zhufeng');
console.log(a.name);


/**
 * S6.2 
 * 当我们写一个类的时候,会得到2个类型
 *   1. 构造函数类型的  函数类型
 *   2. 类的实例类型
 * 
 * 类名本身表示的是 实例的类型
 */
 class Component {
    static myName: string = '静态名称属性';
    myName: string = '实例名称属性';
}

//Component类名本身表示的是实例的类型
//ts 一个叫类型 一个叫值 
//冒号后面的是类型； 等号后面的是值
let c: Component = new Component();
let com = Component;
let f: typeof Component = com;

namespace b {
    function Component() {
        this.myName = '实例名称属性';
    }
    let com = Component;
    Component.myName = '静态名称属性';
    //let c: Component = new Component();
    let f: typeof Component = com;
}


// S7 其他
// 这种接口写法，表示的是 函数及其属性
interface Type1 {
    (name: string): any
    age:number
}
// 这种接口写法，表示的是 对象属性
interface Type2 {
   a: (name: string)=> any
}

let t: any = (name: string) => { };
t.age = 10;
let t1: Type1 = t

let t2: Type2 = {
    a: t1
}