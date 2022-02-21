function * generator(){
    let a = yield 1;
    let b = yield 2;
    let c = yield 3;
}

let it = generator();
let first = it.next();//{done:false,value:1}
console.log(first);
it.return();
let second = it.next();//{done:false,value:2}
console.log(second);
let third = it.next();//{done:false,value:3}
console.log(third);
let fourth = it.next();//{done:true,value:undefined}
console.log(fourth);


