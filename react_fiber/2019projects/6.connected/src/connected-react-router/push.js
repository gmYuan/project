import * as types from './constants';
//我如果向仓库派发了这个动作，就意味着我告诉仓库我要调用history.push(path);
export default function(...args){//args=[path,state]
    return {
        type:types.CALL_HISTORY_METHOD,
        payload:{
            method:'push',
            args
        }
    }
}