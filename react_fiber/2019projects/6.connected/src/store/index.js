import {createStore,applyMiddleware,compose} from 'redux';
import reducer from './reducers';
import history from '../history';
import {routerMiddleware} from '../connected-react-router';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//let store = createStore(reducer);
//当我们想在actions里跳转路径的时候，我们会向仓库派发一个跳转路径的动作。
//然后会由routerMiddle这个中间件进行拦截处理，通过history对象实现路径的跳转
//let store = applyMiddleware(routerMiddleware(history))(createStore)(reducer);
let store = createStore(reducer,composeEnhancers(applyMiddleware(routerMiddleware(history))));
export default store;