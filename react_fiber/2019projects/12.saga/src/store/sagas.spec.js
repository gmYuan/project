import test from 'tape';
import {put,takeEvery,all,call,apply} from 'redux-saga/effects';
import * as types from './action-types';
import {asyncAdd} from './saga';
import {delay} from '../utils';
test('test asyncAdd',(assert)=>{
    //asyncAdd是一个生成器，执行后会产生一个迭代器
    const gen = asyncAdd();
    assert.deepEqual(
        gen.next().value,//{done:false,value:call(delay,3000))}
        call(delay,3000)
    );
    assert.deepEqual(
        gen.next().value,//{done:false,value:call(delay,3000))}
        put({type:types.ADD})
    );
    assert.deepEqual(
        gen.next(),//{done:false,value:call(delay,3000))}
        {done:true,value:undefined}
    );
    assert.end();
});