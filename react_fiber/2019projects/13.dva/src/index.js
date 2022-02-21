import React from 'react';
import keymaster from 'keymaster';
import {Router,Route,Link} from 'dva/router';
import {asyncAdd} from './sagas/counter.js';
//dva是对redux redux-saga react-redux react-rotuer-dom做的一个简单封装
import dva,{connect} from 'dva';
const delay = ms=>new Promise(resolve=>setTimeout(() => {
    resolve();
}, ms));
//执行dva函数可以得到一个app对象，代表dva的应用对象
const app = dva();
//redux dva应用可以会定义很多的模型，为了让各个模型之进行解耦和独立，划分多个命名空间
//redux 有一个状态树 {counter1:{number:0},counter2:{number:0}}
//定义模型
app.model({
    namespace:'counter1',//命名空间
    state:{number:0},//状态对象
    reducers:{//处理器 修改状态的
      //add就是动作的名称action.type 值是一个函数对来计算新状态
        add(state){
             console.log('add');
            return {number:state.number+1};
        }
    },
    effects:{
        //在effects中每个属性都是一个generator
        *asyncAdd(action,{call,put}){//redux-saga/effects {call,put,delay}
            //yield delay(1000);//延迟一秒钟
            yield call(delay,1000);//延迟一秒钟
            yield put({type:'add'});//派发一个动作给仓库，让仓库中的状态number+1
        }
    },
    subscriptions:{
        //我们可以在subscriptions里定义很多个属性和值，值是一个函数，这些函数会在应用初始化的时候执行一次
        keyboard({dispatch}){
            keymaster('space',()=>{
                dispatch({type:'add'});
            });
        }
    }
});
app.model({
    namespace:'counter2',//命名空间
    state:{number:0},//状态对象
    reducers:{//处理器 修改状态的
      //add就是动作的名称action.type 值是一个函数对来计算新状态
        add(state){
             console.log('add');
            return {number:state.number+1};
        }
    },
    effects:{
        //在effects中每个属性都是一个generator
       asyncAdd
    },
    subscriptions:{
        //我们可以在subscriptions里定义很多个属性和值，值是一个函数，这些函数会在应用初始化的时候执行一次
        x({dispatch}){
            keymaster('space',()=>{
                dispatch({type:'add'});
            });
        },
        e({dispatch,history}){
            //给history对象增加一个监听函数当路由发生改变的时候，我们需执行回调，
            history.listen(({pathname})=>{
                document.title = pathname;
            });
        }
    }
});
//model里不用加，model外要加
const Counter1 = props=>(
    <>
        <p>{props.number}</p>
        <button onClick={()=>props.dispatch({type:'counter1/add'})}>add</button>
        <button onClick={()=>props.dispatch({type:'counter1/asyncAdd'})}>asyncAdd</button>
    </>
)
const ConnectedCounter1 = connect(
 state=>state.counter1
)(Counter1);
const Counter2 = props=>(
    <>
        <p>{props.number}</p>
        <button onClick={()=>props.dispatch({type:'counter2/add'})}>add</button>
        <button onClick={()=>props.dispatch({type:'counter2/asyncAdd'})}>asyncAdd</button>
    </>
)
const ConnectedCounter2 = connect(
 state=>state.counter2
)(Counter2);
//定义路由 history=createHashHistory() createBrowserHistory()
app.router(({app,history})=>(
  <Router history={history}>
     <>
       <Link to="/counter1">counter1</Link>
       <Link to="/counter2">counter2</Link>
       <Route path="/counter1" component={ConnectedCounter1}/>
       <Route path="/counter2" component={ConnectedCounter2}/>
     </>
  </Router>
));
//启动应用 ReactDOM.render(<ConnectedCounter/>,document.querySelector('#root'));
app.start('#root');