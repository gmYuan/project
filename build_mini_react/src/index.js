import React from './react';
import ReactDOM from './react-dom';

// let element = <h1>hello world</h1>

let element = React.createElement("h1", {
  style: {
    color: 'red'
  } 
}, "hello22")

console.log('element', JSON.stringify(element) )





ReactDOM.render( element, document.getElementById('root'))