import *  as types from './constants';

export default function(history){
   return function({getState,dispatch}){
       return function(next){
           return function(action){
               if(action.type !== types.CALL_HISTORY_METHOD){
                   return next(action);
               }
               let {payload:{method,args}} = action;
               history[method](...args);
           }
       }
   }
}