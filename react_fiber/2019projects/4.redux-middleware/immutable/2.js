//map=JS中的对象 list=数组
let {Map,fromJS,is} = require('immutable');
let _ = require('lodash');
/* let obj1 = Map({name:'zhufeng'});
let obj2 = obj1.set('name','jiagou');
let obj3 = obj2.set('age',10);
let obj4 = obj3.update('age',x=>x+1);
let obj5 = obj4.merge({home:'北京'});
console.log(obj5); */

/* let obj1 = fromJS({user:{name:'zhufeng',age:10}));
let obj2 = obj1.setIn(['user','age'],11);
let obj3 = obj1.updateIn(['user','age'],x=>x+1);
let obj4 = obj1.mergeIn(['user'],{home:'beijing'}); */

let m1 = Map({name:'zhufeng'});
let m2 = Map({name:'zhufeng'});
console.log('m1 === m2',m1 === m2);
console.log('is(m1,m2)',is(m1,m2))
console.log(_.isEqual({name:'zhufeng'},{name:'zhufeng'}));







