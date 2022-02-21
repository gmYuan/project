
//{ type:types.LOCATION_CHNAGE,payload:{location,action}}
import * as types from './constants';
export default function(history){
    let initialState = {action:history.action,location:history.location};
    return function(state=initialState,action){
        if(action.type === types.LOCATION_CHNAGE){
            return action.payload;
        }
        return state;
    }
}