import {put,takeEvery,all,call,apply, cps,take} from 'redux-saga/effects';
import * as types from './action-types';
import {delay,readFile} from '../utils';

export function* asyncAdd(){//worker saga
    // 如果yield一个promise,当前的saga会进行等待，等待这个promise变成成功态，
    //yield delay2(3000);
    //call就是调用方法的意思，我要让saga中间件帮我调用delay2方法，并传入3000参数，然后它会返回一个promise
    //yield call(delay,3000);
    //let content = yield cps(readFile,'1.txt');
    //console.log('content',content);
    //yield call(delay2,3000);
    //call([context, fnName], ...args)
    //yield call([{name:'zhufeng'},delay3],3000);
    //apply(context, fn, [args])
    //yield apply({name:'zhufeng'},delay3,[3000]);//delay3.apply({name:'zhufeng'},[3000]);
    //产出 个put,相当于派发一个动作, {type:'PUT',action:{type:types.ADD}},当你产出一个put effect对象之后,saga中间件就会向仓库重新派发{type:types.ADD}动作
    /**
    try{
       let result = yield call(delay,1000);
       console.log(result);
       yield put({type:types.ADD});
    }catch(error){
      console.log(error);
    }  
     */
    let result = yield call(delay,1000);
    let {code,data,error} = result;
    if(code === 0){
      yield put({type:types.ADD});
    }else{
         console.log(error);
    }
}

/* function call(fn,...args){
    return {type:'CALL',fn,args};
} */
//这就是我们的watcher saga,负责监听异步加1的动作
export function* watchAdd(){
  /**  
  //我们要监听每一次派发ASYNC_ADD的动作 yield 产出的意思，就是生产出一个effect对象(就是一个普通对象)发给saga中间件，saga中间件会去监听 所有的ASYNC_ADD动作，当这个动作被派发的时候，就会执行asyncAdd这个workder saga
  //takeEvery它不会阻塞当前的saga执行
  yield takeEvery(types.ASYNC_ADD,asyncAdd);
   */
  while(true){
      //我要等待一次ASYNC_ADD动作,它会阻塞当前的saga执行
      //console.log(i,'before take')
      const action = yield take(types.ASYNC_ADD);
      //console.log(action);
      //yield put({type:types.ADD});
      //yield 后在不但可以跟一个promise,还可以跟一个返回promise的方法，还可以跟一个iterator,就是generator saga的执行结果
      yield asyncAdd();
      //console.log(i,'after take')
  }
}
export function* hello(){
     console.log('hello');
}
//saga其实指的就是一个generator函数
export default function* rootSaga(){
    console.log('rootSaga开始执行')
    ///如果你这个项目中多个watcher saga都要启动
    yield all([watchAdd(),hello()]);
    console.log('rootSaga执行结束');
}