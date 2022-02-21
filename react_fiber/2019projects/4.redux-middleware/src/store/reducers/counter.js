import *  as types from '../action-types';
import actions from '../actions/counter';
//import {handleActions} from 'redux-actions';
/* function handleAction(actionCreator,reducer,initialState){
   return function(state=initialState,action){
     if(action.type === actionCreator().type){
            return reducer(state,action);
     }
     return state;
   }
} 
function handleActions(actions,initialState){
    return function(state=initialState,action){
        let reducer = actions[action.type];
        if(reducer){
            return reducer(state,action);
        }
        return state;
         let types = Object.keys(actions);
        for(let i=0;i<types.length;i++){
            let type = types[i];
            if(action.type == type){
                return actions[type](state,action);
            }
        }
        return state; 
    }
}
const initialState = {number:0};
export default handleActions({
    [types.ADD]:(state,action)=>({number:state.number+1}),
    [types.MINUS]:(state,action)=>({number:state.number-1}),
},initialState);
*/
/* let reducer = handleAction(actions.add,(state,action)=>{
 return {number:state.number+1};
},initialState);
export default reducer; */
export default function(state={number:0},action){
    switch(action.type){
        case types.ADD:
           return {number:state.number+1};
        case types.MINUS:
           return {number:state.number-1};   
        default:
           return state;   
    }
} 