
import * as types from './action-types';
let initialState = {
  counter:{number:0},
  recorder:{number:0},
  token:null,
  error:null
};

export default function(state=initialState,action){
    switch(action.type){
        case types.ADD:
          return {...state,number:state.number+1};
        case types.LOGIN_SUCCESS:
          return {...state,token:action.payload,error:null};  
        case types.LOGIN_ERROR:
          return {...state,token:null,error:action.error};
        case types.LOGOUT_SUCCESS:
          return {...state,token:null,error:null};   
        case types.RECORDER_ADD:
           return {...state,recorder:{number:state.recorder.number+1}};       
        default:
          return state;  
    }
}