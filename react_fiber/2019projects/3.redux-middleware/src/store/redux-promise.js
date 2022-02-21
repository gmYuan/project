
function isPromise(obj){
  return !!obj&&(typeof obj ==='object' || typeof obj ==='function')&&typeof obj.then == 'function';
}
export default  function({getState,dispatch}){   //getState用来获取仓库状态 dispatch用来重新开派发动作
  return function(next){//next是为了调用原生的dispatch方法
     return function(action){
       return isPromise(action.payload)?action.payload.then(function(result){
         dispatch({...action,payload:result});
       }).catch(error=>{
          dispatch({...action,payload:error,error:true});
          return Promise.reject(error);
       }):next(action);
     }
  }
}