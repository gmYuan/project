import {put,takeEvery,all,call,apply, cps,take} from 'redux-saga/effects';
import * as types from './action-types';
import {delay,readFile} from '../utils';
import watchLogin from './sagas/watchLogin';
import watchRecoder from './sagas/watchRecoder';
export default function* rootSaga(){
    yield all([watchLogin(),watchRecoder()]);

}