import * as service from '../services/role';
import {message} from 'antd';
import qs from 'querystring';
import {routerRedux} from 'dva/router';
const ENTITY = 'role';
export default {
    namespace:ENTITY,
    state:{
        list:[],
        pageNum:1,
        total:0,
        isCreate:true,//是否是新增的情况
        editVisible:false,//控制模态窗口是否显示
        record:{},//代表当前要编辑的对象
        selectedRowKeys:[],//此处存放当前选中的行的数组
        selectedRows:[],
        where:{},//表示当前的查询条件
        resources:[],//总的菜单树
        SetPermissionVisible:false,//默认不显示 是否显示给角色分配资源的窗口
        checkedKeys:[],//当前树中的哪些节点被选中
        targetKeys:[],
        users:[],
        setUserVisible:false
    },
    reducers:{
        save(state,{payload}){
            return {...state,...payload};
        }
    },
    effects:{
        *fetch({payload:{pageNum,where}},{call,put,select}){//query={pageNum:3}
            if(!pageNum){
                pageNum = yield select(state=>state[ENTITY].pageNum);
            }
            pageNum=parseInt(pageNum);
            if(!where){
                where = yield select(state=>state[ENTITY].where);
            }
            let result = yield call(service.fetch,pageNum,where);//{list,total}
            if(result.code === 0){
                yield put({type:'save',payload:{...result.data,pageNum,where}});
            }else{
                message.error(result.error);
            }
        },
        // /admin/user?pageNum=1&username=1 /admin/user?pageNum=2&username=1 
        *search({payload:where},{call,put}){
            //yield put({type:'fetch',payload:{where,query:{}}});//{list,total}
            //dispatch({type:'fetch',payload:query});
            let whereString = qs.stringify(where);
            yield put(routerRedux.push(`/admin/${ENTITY}?pageNum=1&${whereString}`));
        },
        *create({payload},{call,put,select}){
            let result = yield call(service.create,payload);
            if(result.code === 0){
                let pageNum = yield select(state=>state[ENTITY].pageNum);//select用来获取状态树的特定状态
                yield put({type:'fetch',payload:{pageNum}});//添加用户之后要重新查询数据
                yield put({type:'save',payload:{editVisible:false}});//把窗口关掉
            }else{
                message.error(result.error);
            }
        },
        *update({payload},{call,put}){
            let result = yield call(service.update,payload);
            if(result.code === 0){
                //如果更新的话，页码最好不要变

                yield put({type:'fetch',payload:{pageNum:1}});//添加用户之后要重新查询数据
                yield put({type:'save',payload:{editVisible:false}});//把窗口关掉
            }else{
                message.error(result.error);
            }
        },
        *del({payload},{call,put}){
           let result = yield call(service.del,payload);
            if(result.code === 0){
                yield put({type:'fetch',payload:{pageNum:1}});//添加用户之后要重新查询数据
            }else{
                message.error(result.error);
            }
        },
        *delAll({payload},{call,put}){//payload是一个用户对象ID数组[1,2,3]
            let result = yield call(service.delAll,payload);
            if(result.code === 0){
                yield put({type:'fetch',payload:{pageNum:1}});//添加用户之后要重新查询数据
            }else{
                message.error(result.error);
            }
        },
        *getResources({payload},{call,put}){
            let result = yield call(service.getResources);
            yield put({type:'save',payload:{resources:result.data}});
        },
        *setRolePermission({payload},{call,put,select}){
            let {record,checkedKeys,where} = yield select(state=>state.role);
            yield call(service.setRolePermission,{roleId:record.id,resourceIds:checkedKeys});
            let whereString = Object.keys(where).length>0?qs.stringify(where):"";
            yield put(routerRedux.push(`/admin/${ENTITY}?pageNum=1${whereString?("&"+whereString):""}`));
            yield put({type:'save',payload:{SetPermissionVisible:false,selectedRowKeys:[],selectedRows:[]}});
        },
        *getUsers({payload},{call,put}){
            let result = yield call(service.getUsers);
            yield put({type:'save',payload:{users:result.data}});
        },
        *setRoleUser({payload},{call,put,select}){
            let {record,targetKeys,where} = yield select(state=>state.role);
            yield call(service.setRoleUser,{roleId:record.id,userIds:targetKeys});
            let whereString = Object.keys(where).length>0?qs.stringify(where):"";
            yield put(routerRedux.push(`/admin/${ENTITY}?pageNum=1${whereString?("&"+whereString):""}`));
            yield put({type:'save',payload:{setUserVisible:false,selectedRowKeys:[],selectedRows:[]}});
        }
    },
    subscriptions:{
        setup({history,dispatch}){
            //每当路径发生改变的时候 /admin/user?pageNum=3
            history.listen(({pathname,query})=>{//query={pageNum:'3'}
                if(pathname === `/admin/${ENTITY}`){
                    let {pageNum,...where} = query;//pageNum=1&username=1&email=2
                    dispatch({type:'fetch',payload:{pageNum,where}});
                    dispatch({type:'getResources'});///api/role/getResource
                     dispatch({type:'getUsers'});
                }
            });
        }
    }
}