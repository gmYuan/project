 export function *asyncAdd(action,{call,put,fork}){//redux-saga/effects {call,put,delay}
    //yield delay(1000);//延迟一秒钟
    yield fork(delay,1000);//延迟一秒钟
    yield put({type:'add'});//派发一个动作给仓库，让仓库中的状态number+1
}