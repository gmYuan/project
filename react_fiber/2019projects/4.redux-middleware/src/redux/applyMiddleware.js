import compose from './compose';
export default function applyMiddleware(...middlewares){//middlewares=['thunk','logger']
  return function(createStore){
    return function(...args){
       let store = createStore(...args);
       let dispatch;
       let middlewareAPI= {
         getState:store.getState,//获取仓库中的状态
         dispatch:(...args)=>dispatch(...args)//派发动作
       };
       const chain = middlewares.map(middleware=>middleware(middlewareAPI));
       dispatch = compose(...chain)(store.dispatch);
       return {
          ...store,
          dispatch
       };
    }
  }
}