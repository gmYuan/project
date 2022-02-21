export default  function({getState,dispatch}){   //getState用来获取仓库状态 dispatch用来重新开派发动作
  return function(next){//next是为了调用原生的dispatch方法
     return function(action){
       if(typeof action === 'function'){//如果派发了一个函数过来
         return action(dispatch);
       }else{
          next(action);
}}}}