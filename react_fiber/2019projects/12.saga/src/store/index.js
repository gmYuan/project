import {createStore,applyMiddleware} from 'redux';
import reducer from './reducer';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import rootSaga from './saga.js';
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer,applyMiddleware(thunk,sagaMiddleware));
sagaMiddleware.run(rootSaga);
export default store;




/**
//const store = applyMiddleware(sagaMiddleware)(createStore)(reducer);
function createStore(reducer,preloadedState,enhancer){
   if(typeof preloadedState == 'function' && typeof enhancer === 'undefined'){
       enhancer = preloadedState;
       preloadedState=undefined;
   } 
   if(typeof enhancer == 'function'){
      return enhancer(createStore)(reducer,preloadedState);
      return applyMiddleware(sagaMiddleware)(createStore)(reducer,preloadedState);
   }
}
 */