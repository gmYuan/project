export {}


//内置条件类型

// 例1：Exclude 排除
type Exclude<T, U> = T extends U ? never : T;
type R4 = Exclude<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'>;  


// 例2：Extract 抓取
type Extract<T, U> = T extends U ? T : never;
type R5 = Extract<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'>;  //Pick


// 例3: NonNullable 非空
type NonNullable<T> = T extends null | undefined ? never : T;
type R6 = NonNullable<'a' | null | undefined>;  


// 例4: ReturnType 获取返回值的 类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : T;
function getUser(a:string,b:number){
    return {name:'zhufeng',age:10};
}
type GetUserType = typeof getUser;
type ReturnUser = ReturnType<GetUserType>;


// 例5: Parameters 获取函数参数的 类型
type Parameters<T> = T extends ((...args: infer P) => infer R) ? P|R : never;
type X1 = {}
type ParamsType = Parameters<GetUserType>;



class Person8{
    name:string;
    constructor(name:string){
        this.name = name;
    }
    getName(){console.log(this.name);}
}

// 例6: ConstructorParameters  获取类的构造函数的参数类型
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (
    ...args: infer P) => any ? P : never;
type Params = ConstructorParameters<typeof Person8>;


// 例7: InstanceType  获取类的 实例对象的类型
type InstanceType<T extends new (...args: any) => any> = T extends new (
    ...args: any) => infer R ? R : any;

type TPerson8=  typeof Person8
type Person8Instance = InstanceType<TPerson8>
let instance: Person8Instance={
    name:'zf',
    getName(){}
}


// infer应用案例
type First<T> = T extends {name:infer A} ?A:never;
type K11 = First<{name:string}>

// 案例1: tuple转union
type ElementOf<T> = T extends Array<infer E> ? E : never;
type Ttuple = [string,number,boolean];
type TupleToUnion = ElementOf<Ttuple>;  //string | number // 联合类型

// 案例2:  联合类型转成交叉类型，即  string | number => string & number
type ToIntersection<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void }
? U : never;

type T1 = {name:string};
type T2 = {age:number};
type T3 = ToIntersection< { a: (x: T1) => void, b: (x: T2) => void }>

//T1 & T2 交集 交叉类型
let t33:T3 = {name:'',age:10};

