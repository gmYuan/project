import {put,takeEvery,all,call,apply, cps,take,fork,cancel,cancelled} from 'redux-saga/effects';
import Api from '../../Api';
import * as types from '../action-types';
//worker saga
export function* login(user){//user={name,pass}
  try{
    //为了方便写单元测试
    //const token = yield Api.login(user);
    localStorage.setItem('loading',true);
    const token = yield call(Api.login,user);
    localStorage.setItem('loading',false);
    yield put({type:types.LOGIN_SUCCESS,payload:token});
  }catch(error){
      alert(error);
     yield put({type:types.LOGIN_ERROR,payload:error})
      localStorage.setItem('loading',false);
  }finally{
    if(yield cancelled())
     localStorage.setItem('loading',false);
  }
}
export default function* watchLogin(){
  //这是为什么不用takeEvery,而要使用while(true)
  while(true){
    let action = yield take(types.LOGIN_REQUEST);
    //const token = yield call(login,action.payload);
    //以fork开启一个新的进程的方式启动login方法，如果用fork的话不会阻塞当前的saga,当前的saga会立刻向下执行
    //如果是用fork执行的任务，返回一个代表当前任务的task对象
    const task = yield fork(login,action.payload);
    console.log(task)
    //同时监听两个动作 一个退出的请求action，一个登录失败的请求action
    //take里如果传的是一个数组的话，那么就是说只要监听到任意一个动作就往往下执行
    action = yield take([types.LOGOUT_REQUEST,types.LOGIN_ERROR]);
    if(action.type === types.LOGOUT_REQUEST){
    //这是在告诉saga中间件，我要取消掉task任务的执行，中间件会判断，如果此任务已经完成，什么都不会，如果任务没有完成，正在进行中，立刻中此这个任务saga
      yield cancel(task);  
      yield put({type:types.LOGOUT_SUCCESS});
    }
  }
}