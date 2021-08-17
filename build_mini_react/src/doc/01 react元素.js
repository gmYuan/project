import React from 'react';
import ReactDOM from 'react-dom';

let element = <h1>hello world</h1>
console.log('element', JSON.stringify(element) )

//  react元素 === 虚拟DOM === 一个具有 type/props等属性的 JS对象
// {
//   type:"h1",
//   key: null,
//   ref:null,
//   props: {
//     children: "hello world"
//   }
//   _owner:null,
// }


ReactDOM.render( element, document.getElementById('root'))