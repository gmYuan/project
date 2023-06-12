import { put, take, takeEvery} from '../../redux-saga/effects';
import * as actionTypes from '../action-types';
//S1 监听saga- take方法
// function* addListener(){
//     for(let i=0;i<3;i++){
//         yield take(actionTypes.ASYNC_ADD);
//         yield put({type:actionTypes.ADD});
//     }
//     return 'add3';
// }

// export default addListener;


// -------------------------------------
//S2 监听saga- takeEvery方法

// work sage
function* addWorker(){
    yield put( {type:actionTypes.ADD} );
    console.log('work saga end')
}

// watch sage
function*  addListener(){
    // debugger
    yield takeEvery(actionTypes.ASYNC_ADD, addWorker)
    console.log('watch saga end');
}

// root saga
export default function* rootSaga() {
   yield addListener();
   console.log('root saga end')
}


