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
S1    store/index ==> 执行了A(...middles) ==> 返回了enhancer/B
S2.1  createStore ==> 执行了B(createStore) ==> 返回了C
S2.2 C(reducer,initState) ==>  return { ...store, dispatch }，具体流程：

  S3.1 let chain = [ middleware(api1), middleware(api2) .... ] ==>  [nextFn3, nextFn2..]  
  S3.2 dispatch = compose(...chain)(store.dispatch) ==> 
    S4.1 compose(...chain) ==> Fn1 =  (...args)=> next3( next2(...args) ) ==> 
    即 `retrun temp = (...args) => Fn1( next1(...args) )`
    
      S5.1 temp(store.dispatch) ==> Fn1( next1(dispatch) ) ==> Fn1(action1)
      S5.2 Fn1(action1) ==> next3( next2(action1) ) ==> next3(action2) ==> action3Fn

  S3.3 所以最后的返回结果就是 { ...store, dispatch: action3函数 }

S4 所有当配置了中间件后，store/index ==> 返回值是改造了dispatch的 store对象 { ...store, dispatch: action3函数 }

S5 当dispatch(action)时，实际是调用 middleware_action3(action)
  S6.1 当满足了mid3的执行条件时，就会触发dispatch(已被改为 mid_action3) 再次执行
  S6.2 当不满足mid3的执行条件 ==> return next(action) ==> action2(action) ==> action1(store.dispatch)

![redux_44_01](https://s4.ax1x.com/2022/02/15/H2N60I.png)
![redux_44_02](https://s4.ax1x.com/2022/02/15/H2N7Bn.png)
![redux_44_03](https://s4.ax1x.com/2022/02/15/H2Nxc4.jpg)

-----------------------------
Q6：如何实现 connect-react-router

A:
S1 作用：
  - 作用1：可以实现 通过派发动作的方式 修改路径
  - 作用2：可以把当前最新的路由信息，存储到 store中

S2 初始化流程
1.1  React-redux.Provider ==> store = applyMiddleware(routerMiddleware(history))(createStore)(combinedReducer)
  1.2 routerMiddleware(history) ==> 返回 A = function (middlewareAPI){}
  1.3 Redux.applyMiddleware(A) ==> 返回 B = function (createStore) {}
  1.4 B(createStore) ==> 返回 C = function (reducer,preloadedState) {}
  1.5 C(combinedReducer) ==> 返回 store = D =  { ...store, dispatch }

2.1 C(combinedReducer) ==> middlewares = [A]
  2.2 A(middlewareAPI) ==> 返回 next1 =  function (next){}, 即 E = [next1, next2]
  2.3 compose(...chain) ==> 返回 F = (...args)=>acc(cur(...args))) = next1()
  2.4 F(store.dispatch) ==> 返会 dispatch = G =  function(action){}


3.1 <ConnectedRouter history /> ==> 
  - 返回 <Router history={history}>包裹子组件，以支持如Link等的 路由组件
  - history.listen监听路由发生变化 + dispatch( onLocationChange(location, action) )
  - dispatch(onLocationChange)会被 reducers.router处理


S3 Counter组件内事件流程
4.1 connent(state, acitons)(Counter) ==>  bindActionCreators(mapDispatchToProps, dispatch);
  4.2 bindActionCreators(actions, dispatch) ==> 返回A = { goto: fnB(...args) } +           actionCreator = goto 且  dispatch = store.dispatch

4.3 handleGo ==> this.props.goto('/') ==> fnB('/') ==> 返回C = dispatch( goto('/') )
  4.4 goto('/') ==> return push('/') ==> 返回D = { type:xxx, payload: yyy }的 特定action对象
即 `C = dispatch(D)`

4.5 dispatch已经被绑定了中间件，所以会执行中间件相关逻辑 ==> history.xxxx()等方法
 
 -----------------------------
Q7 如何实现 redux-saga

A：
S1.1  src/index ==> <Provider store={store}> ==> store/index ==> fnA = createSagaMiddleware() 
S1.2  store = applyMiddleware(sagaMiddleware)(createStore)(reducer) 
  - S2.1 boundRunSaga = runSaga.bind( null,{channel,dispatch,getState} )
  - 更新覆盖 原生dispatch

S1.3 sagaMiddleware.run(rootSaga) + rootSaga是一个generator
  - S2.2  fnA.run(rootSaga) ==> boundRunSaga(rootSaga)


S2.1  boundRunSaga = runSaga.bind( null,{channel,dispatch,getState} )
  - channel = stdChannel() ==> return B = {once,trigger}
  - dispatch 指向的是 改造后的 fnA的aciton代理函数

S2.2 boundRunSaga(rootSaga) ==> runSaga(env, saga)
  - S3.1  next1() ==>  take(ASYNC_ADD) ==> 返回 effect = { type: 'TAKE',  actionType: 'ASYNC_ADD' } ==> S3.2 effect.type分发

  - S3.2 effect.type === 'TAKE' ==>   channel.once(effect.actionType, next);

  - S3.3channel.once(effect.actionType, next) ==> 定义next.actionType + 入队
  
S4.1 触发事件 ==> channel.trigger(action) ==> 只要next.actionType ===  action.type ===>  再次调用 next(action)，继续执行generator ==>  put( {type: 'ADD'} ) ==> 返回 C = { {type: 'PUT' , {type: 'ADD'} } ==> 

S4.2 effect.type === 'PUT' ==> dispatch(effect.action) ==> reducer()


 -----------------------------
Q7 如何实现 redux-saga的 takeEvery

A：
1.1 sagaMiddleware.run = (saga)=>boundRunSaga(saga) ==> runSaga({channel, dispatch}, rootSaga, cb) + 调用 next() ===> 
1.2 resA = yield addListener()，即 resA={value: itB, done: false } ==> itB为迭代器，递归调用runSaga 

  2.1 runSaga(env, itB) ==> next() ==> 返回 resC = yield takeEvery(actionTypes.ASYNC_ADD, addWorker)
  2.2 takeEvery("ASYNC_ADD", workSage) ==> fork(takeEveryHelper) = { type: effectTypes.FORK, takeEveryHelper }
  2.3 即 resC = {'FORK', takeEveryHelper} +  type为FORK ===>
  2.4 resD = runSaga(env, takeEveryHelper)

    3.1 runSaga(env, takeEveryHelper) ==>  next() ==> 返回resE =  yield take(actionType)
    3.2 take(actionType) ==> 即 resE = { done: false, value: {actionType: "ASYNC_ADD", type: "TAKE"} }
    3.3 type为 TAKE ==>  channel.once(resE.actionType, next) 入队
    3.4 return task ==> 3.X 的runSage结束

  2.5 继续执行 next(forkTask)
  2.6 return task ==> 2.X 的runSage结束

1.3 return task ==> 1.X 的runSage结束




