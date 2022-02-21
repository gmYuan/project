import {combineReducers} from 'redux';
import counter from './counter';
import {connectRouter} from 'connected-react-router';
import history from '../../history';
//增了一个子的reducer,也给总的状态状态树增加了一个子状态
//{counter:{number:0},router:{action:'POP',pathname:'/'}}
//每当地址里的路径发生改变 的时候，都会向仓库派发一个动作，然后由仓库中的router reducer把最新的动作类型和最新的路径保存在仓库状态树中
let reducer = combineReducers({
    counter,
    router:connectRouter(history)
});
export default reducer;