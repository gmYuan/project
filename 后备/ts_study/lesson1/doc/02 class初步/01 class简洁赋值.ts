class order {
  // name: string
  // price: number
  // tip!: string     // TS简洁赋值
  constructor(public name: string, public price: number)  {
    // this.name = name
    // this.price = price
  }
}

let order1 = new order('订单1', 20)
console.log('order1--', order1)

export {}