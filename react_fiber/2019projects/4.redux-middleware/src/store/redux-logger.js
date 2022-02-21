export default  function({getState,dispatch}){   //getState用来获取仓库状态 dispatch用来重新开派发动作
  return function(next){//next是为了调用原生的dispatch方法
     return function(action){
         console.log(`老状态:${JSON.stringify(getState())}`);
         next(action);
         console.log(`新状态:${JSON.stringify(getState())}`);
     }
  }
}