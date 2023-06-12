export {}

// 例1: 可选参数
interface A{
    a:string
    b:number
    c:boolean
}
type Partial<T> = {
    [P in keyof T]+?: T[P];
};
type PartialA = Partial<A>;
let a: PartialA = {
    a:'',
    b:1
}


// 例2:  深度/递归 可选参数
interface Company{
    id:number;
    name:string;
}
interface Person{
    id:number;
    name:string;
    company: Company
}

type DeepPartial<T>= {
    [U in keyof T]+?: T[U] extends object ? DeepPartial<T[U]> : T[U]
}
type PartialPerson = DeepPartial<Person>;
let p: PartialPerson = {
    id:1,
    name:'zhufeng',
    company:{}
}


// 例3:  必选参数
namespace namespaceA {
    interface Person {
        name:string;
        age?:number;
    }
    type Required<T> = {
        [P in keyof T]-?: T[P];
    };

    type RequiredPerson = Required<Person>;
    let p: RequiredPerson={
        name:'zhufeng',
        age:11
    }
}

// 例4:  Readonly
namespace namespaceB {
    interface Person {
        name: string;
        age: number;
    }
    type Readonly<T> = {
        readonly [P in keyof T]: T[P];
    };
    type Tp1 = Readonly<Person>
    let p1: Tp1 
    // p1.name = 'jiagou';

    // 实现方法2
    type ReadOnlyNamePerson = Person & {
        readonly name:string;
    };
    let p2: ReadOnlyNamePerson = {
        name: 'zhufeng',
        age: 11
    }
    // p2.name = 'jiagou';
    p2.age = 12;
}

namespace namespaceC {
    // 例5:  Pick 摘取某一项
    interface Person {
        name: string;
        age: number;
        gender:number
    }
    let person:Person = { name:'zhufeng', age:11, gender:1 }
    // type KeyOfPerson = keyof Person;        // 'name'|'age'|'gender'
    type Pick<T, K extends keyof T> = {
        [P in K]: T[P];
    };
    type PickPerson = Pick<Person, 'name'|'age'>


    //例6: 提取 Extract <== 有条件类型分发
    type Extract<T, U> = T extends U ? T : never;
    //有条件类型分发
    type E = Extract<string | number| boolean, string | number>;
    let e: E = '1';
}

 //例7: Record记录类型 ==> 对 对象的value类型进行约束
namespace namespaceD {
  type KeyOfAny = keyof any;    //string | number | symbol

  // Record实现
  type Record<K extends keyof any, T> = {
    [P in K]: T;
    // [P: string]: string,
    // [P: number]: string
  };
  let k: Record<string | number, string>= { name:'zhufeng', age:'11',  3: '12' };  


  //Record应用
  function mapObject<K extends string | number, T, U>(
    obj: Record<K,T>, map: (x:T)=>U)
  {
    // let result: Record<K, U> = {};
    let result: Record<K, U> = <Record<K, U>> {};
    
    for(const key in obj){
        result[key]=map(obj[key]);
    }
    return result;
  }

  let obj = { count1:1, count2:2, 3: 3 };
//   let obj = { count1:1, count2:2, 3: '3' };

  let map = (x: number):string => x * 2 + '';
  let newObj = mapObject<string | number, number, string>(obj, map);
  console.log('newObj--', newObj)
  // 结果为  { count1:2, count2:4, 3: '6' }
}