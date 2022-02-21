import * as types from '../action-types';
export default {
    add(){
        return {type:types.ADD};
    },
    asyncAdd(){
        //在redux中派发的动作只能是纯对象，并不能函数 store.dispatch
       return function(dispatch){
           setTimeout(() => {
              dispatch(function(dispatch){
                    setTimeout(() => {
                        dispatch({type:types.ADD});
                    }, 1000);
                });
           }, 1000);
       }
    },
    promiseAdd(){
        return {
            type:types.ADD,
            payload:new Promise(function(resolve,reject){
                 setTimeout(() => {
                     resolve(5);
                 }, 1000);
            })
        }
        //{type:types.ADD,payload:5}
    }
}