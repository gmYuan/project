/**
 *  自定义类型
 */

// 例1  差集：A-B = Exclude
export type SetDifference<A,B>= A extends B ?never:A;
type A = string|number;
type B = number|boolean;
type AB = SetDifference<A,B>;


// 例2:  Omit：剔除(后) + 选取
//Omit = Exclude + Pick
//S1 keyof T = name | age| visible
//S2 K = age
//S3 SetDifference ==>  name | visible
type Omit<T, K extends keyof any>= Pick< T, SetDifference<keyof T,K> >

type Props = { name:string, age:number, visible:boolean};
type OmitAgeProps = Omit<Props,'age'>        // {name:string,visible:boolean};


// 例3: Diff 差异
namespace na{
    type Props = { name: string, age: number, visible: boolean };
    type DefaultProps = { age:number };

    type Diff<T extends object, U extends object> = Pick<
        T, SetDifference<keyof T, keyof U>
    >;
    type DiffProps = Diff<Props, DefaultProps>;     // { name:string, visible:boolean };
}


// 例4: InterSection 交叉属性
namespace nb {
    type InterSection<T extends object, U extends object>=Pick<
        T,
        Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
    >;

    type Props = { name: string, age: number, visible: boolean };
    type DefaultProps = { age: number };

    type InterProps = Props & DefaultProps;
    type DuplicateProps = InterSection<Props, DefaultProps>;
}

// 解释  Extract<keyof T, keyof U> &  Extract<keyof U, keyof T>
type Inter1<T, U> = Extract<keyof T, keyof U> & Extract<keyof U, keyof T>;
type Inter2<T, U> = Extract<keyof T, keyof U>;
type Inter3<T, U> = Extract<keyof U, keyof T>;

type T1 = {name:string,age:number};
type T2 = {age: string,married:boolean };
type K1 = Inter1<T1,T2>
type K2 = Inter2<T1, T2>
type K3 = Inter3<T1, T2>


// 例5: Overwrite 重写
namespace nc {
    type OldProps = { name: string, age: number, visible: boolean };
    type NewProps = { age:string, other:string }
    // { name: string, visible: boolean , age:string }

    type Diff<T extends object, U extends object> = Pick<
        T, SetDifference<keyof T, keyof U>
    >;
    type InterSection<T extends object, U extends object> = Pick<T,
        Extract<keyof T, keyof U> & Extract<keyof U, keyof T>>;

    type Overwrite< 
      T extends object,  U extends object,
       // {name: string,visible: boolean }  &  {age:string}  ==>
       //  {name: string, visible: boolean, age:string }
       I = Diff<T,U> & InterSection<U,T>
    >=Pick< I, keyof I>

    type ReplacedProps = Overwrite<OldProps, NewProps>;
}


// 例6: Merge = Compute+Omit<U,T> 合并
namespace nd {
    type O1 ={
        id:number;
        name:string
    }
    type O2 = {
        id:number;
        age:number;
    }
    type Compute<A extends  any>=A extends Function? A: { [K in keyof A]:A[K] }
    type R1 = Compute< { x: 'x' } & {  y: 'y' }>
    type R3 = Compute<string>

    type Omit<T, K extends keyof any> = Pick<T, SetDifference<keyof T, K> >;
    type Merge<O1 extends object, O2 extends object> = Compute<
      O1 & Omit<O2,keyof O1>
    >
    type R2 = Merge<O1,O2>;  // { id:number, name:string, age:number }

}