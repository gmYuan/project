
import {message} from 'antd';
import {decode} from 'jsonwebtoken';
import * as service from '../services/login';
import {routerRedux} from 'dva/router';
export default {
    namespace:'login',
    state:{
        user:null,//代表当前的登录用户
        isLogin:false
    },
    reducers:{
        save(state,action){
            return {...state,...action.payload};
        }
    },
    effects:{
        *signup({payload},{put,call}){
            let result = yield call(service.signup,payload);//{code:0,data} {code:1,error}
            if(result.code === 0){
                yield put({type:'save',payload:{isLogin:true}});
            }else{
                message.error(result.error);
            }
        },
        *signin({payload},{put,call}){
            let result = yield call(service.signin,payload);//{code:0,data} {code:1,error}
            if(result.code === 0){
               //如果登录成功了需要跳到后台管理中心页
               //1.把返回值jwt token放到localStorage里去，以便刷新的时候能重新获取回来
               let token = result.data;
               let user = decode(token); 
               yield put({type:'save',payload:{user}});//redux在内存里，一刷新就没了
               localStorage.setItem('token',token);//把token保存到localStorage里面
               //跳到后台理中心页 /admin routerRedux connected-react-router
               //routerRedux.push('/admin') {type:'@@redux/CHANGE_LOCATION',path:'/admin'}
               yield put(routerRedux.push('/admin'));
            }else{
                message.error(result.error);
            }
        },
        *loadUser(action,{put}){
            let token = localStorage.getItem('token');
            let user = decode(token); 
            yield put({type:'save',payload:{user}});
        }
    }
    
}