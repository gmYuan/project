/**
  永远只能一个仓库, 状态也只能一个
  仓库只有一个，但是组件可能会非常非常多
  
 */
export default  function createStore(reducer){
    let state;
    let listeners = [];
    //负责返回当前的状态
    function getState(){
        return state;
    }
    //我们可以派发一个动作，现在规定要想修改状态，只能通过派发动作的方式来修改
    function dispatch(action){
       state = reducer(state,action);
       listeners.forEach(l=>l());
    }
    //subscribe方法每次调用都会返回一个取消订阅的方法
    function subscribe(listener){ 
       listeners.push(listener);
       return function(){
           listeners = listeners.filter(item=>item!==listener);
       }
    }
    dispatch({type:"@@TYEP/REDUX_INIT"});
    return {dispatch,getState,subscribe};
}