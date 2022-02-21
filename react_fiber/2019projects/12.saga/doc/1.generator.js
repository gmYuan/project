function * generator(){
    let a = yield 1;
    console.log('a',a);
    let b = yield 2;
    let c = yield 3;
}
//tj co库
let it = generator();
let first = it.next();//{done:false,value:1}
console.log(first);
let second = it.next('a');//{done:false,value:2}
console.log(second);

