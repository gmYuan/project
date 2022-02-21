import {race,call,take,delay,put} from 'redux-saga/effects';
import *  as types from '../action-types';
function * start(){
    while(true){
        yield delay(1000);
        yield put({type:types.RECORDER_ADD});
    }
}
function* stop(){
  yield take(types.CANCEL_RECORDER);
}
export default function* watchRecorder(){
    //如果有一个结束了，其它任务都取消掉
    yield race({
        start:call(start),
        stop:call(stop)
    });
}