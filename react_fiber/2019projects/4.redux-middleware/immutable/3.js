let {List,fromJS,is} = require('immutable');
let l1 = fromJS([1,2,3]);
console.log(l1);
console.log(l1.size);
let l2 = l1.push(4);
console.log(l2);
let l3 = l2.pop();
let l4 = l3.update(2,x=>x*2);
console.log(l4);//1,2,6
let l5 = l4.concat([5,6]);
let l6 = l5.map(x=>x*2);
let l7 = l6.filter(x=>x%2===0);
let num = l7.get(0);
let exist2 = l7.includes(2);




