import {createStore,applyMiddleware} from 'redux';
import reducer from './reducers';
import logger from './redux-logger';
import thunk from './redux-thunk';
import promise from './redux-promise';
import {persistStore,persistReducer} from '../redux-persist';
import storage from '../redux-persist/lib/storage';
const persistConfig = {
    key:'root',
    storage,
    //whitelist: ['counter'],
    blacklist: ['counter1','counter2'],
}
let rootReducer = persistReducer(persistConfig,reducer);
let store = applyMiddleware(promise,thunk,logger)(createStore)(rootReducer);
let persistor = persistStore(store);
export {store,persistor};