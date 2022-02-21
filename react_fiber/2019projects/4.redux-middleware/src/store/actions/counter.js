import * as types from '../action-types';

export default {
    add(){
        return {type:types.ADD};
    },
    minus(){
        return {type:types.MINUS};
    }
}
/**
//import {createAction,createActions} from 'redux-actions';
//它其实是创建的也是AcionCreator 
 function createAction(type,createPayload){
   return function(...args){
       return {type,payload:createPayload(...args)};
   }
}
//const add = createAction(types.ADD,(amount)=>amount*2);
//const minus = createAction(types.MINUS,(amount)=>amount*2);
//{add,minus}
function createActions(actions){
  let newActions = {};
  let types = Object.keys(actions);//[types.ADD,types.MINUS]
  for(let i=0;i<types.length;i++){
      let type = types[i];
      newActions[type]= function(...args){
         return {type,payload:actions[type](...args)};
      }
  }
  return newActions;
}
export default createActions({
    [types.ADD]:(amount)=>amount*2,
    [types.MINUS]:(amount)=>amount*2,
})
 */