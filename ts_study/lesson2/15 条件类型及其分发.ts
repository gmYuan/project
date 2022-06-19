export {}

/**
 *   例1：条件类型
 */
interface Fish{
    name1:string;
}
interface Water{
    name2:string;
}
interface Bird{
    name3:string;
}
interface Sky{
    name4:string;
}

type Condition<T> = T extends Fish?Water:Sky;
// type Condition<T> = { t: T } extends { t: Fish} ? Water : Sky;
//let con:Condition<Fish> = {name2:'水'};

//例1.2: 条件类型的分发
let con1: Condition<Fish | Bird> = { name2:''};
let con2: Condition<Fish | Bird> = { name4: '' };

// 找出T中不包含U的部分
type Diff<T,U> = T extends U?never:T;
type R = Diff<'a'|'b'|'c'|'d' , 'a'|'b'|'c'>;  
type R2 = 'd';

type Filter<T,U> = T extends U?T:never;
type R3 = Filter<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'>;  