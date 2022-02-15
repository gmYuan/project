## Rudux小结

Q1：如何基本使用redux

A:
![40_1](https://s4.ax1x.com/2022/02/10/HtzQeO.png)
![40_2](https://s4.ax1x.com/2022/02/10/HtzU6P.png)

-----------------------------
Q2：如何使用Action和 bindActionCreators

A:
![redux_41_01](https://s4.ax1x.com/2022/02/14/HcE1zQ.png)
![redux_41_02](https://s4.ax1x.com/2022/02/14/HcEbwt.png)

-----------------------------
Q3：如何实现 react-redux

A:
![redux_42_01](https://s4.ax1x.com/2022/02/14/HcVxN6.jpg)
![redux_42_02](https://s4.ax1x.com/2022/02/14/HcZu8S.jpg)
![redux_42_03](https://s4.ax1x.com/2022/02/14/HcZY5V.jpg)
![redux_42_04](https://s4.ax1x.com/2022/02/14/HcZDbR.jpg)
![redux_42_05](https://s4.ax1x.com/2022/02/14/HcZWxe.jpg)

-----------------------------
Q4：如何实现 react-redux的hooks

A:
![redux_43_01](https://s4.ax1x.com/2022/02/14/HcemZR.png)
![redux_43_02](https://s4.ax1x.com/2022/02/14/HceMi6.png)
![redux_43_01](https://s4.ax1x.com/2022/02/14/HceNdI.png)

-----------------------------
Q5：如何实现 middleware中间件

A:
![redux_44_01]()


S1    store/index ==> 执行了A(...middles) ==> 返回了enhancer/B
S2.1  createStore ==> 执行了B(createStore) ==> 返回了C
S2.2 C(reducer,initState) ==>  return { ...store, dispatch }，具体流程：
  S3.1 let chain = [ middleware(api1), middleware(api2) .... ] ==>  [nextFn1, nextFn2..]  
  S3.2 dispatch = compose(...chain)(store.dispatch) ==> 
    S4.1 compose(...chain) ==> 难点reduce理解，结果为



