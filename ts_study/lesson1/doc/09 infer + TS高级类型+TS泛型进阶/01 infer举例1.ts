interface Customer {
  custname: string
  buymoney: number
}

// （1）infer 出现在 extends 条件语句后的函数类型的参数类型位置上
type custFuncType = (cust: Customer) => void
type inferType<T> = T extends (param: infer P) => any ? P : T

type inferTypeExample = inferType<custFuncType>// 结果为Customer


//（2）infer 出现在 extends 条件语句后的函数类型的返回值类型上 
type custFuncType2 = (cust: Customer) => string// 函数类型 
type inferType2<T> = T extends (params: any) => infer P ? P : T

// 输出函数的返回值类型string
type inferResultType = inferType2<custFuncType2>



export { }