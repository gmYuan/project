import React from './react';
import ReactDOM from './react-dom';

// S1 react_07 ~ react_08
// const onClick = () => { console.log('hello') }
// let element = React.createElement( 
//   'button', 
//   {id: 'sayHello', onClick}, 
//   'say',  React.createElement( 'span',  {color: 'red'},  'hello' )
// )


// S2 react_09
const onClick = () => { console.log('hello') }
let element = React.createElement( 
  'button', 
  {id: 'sayHello', onClick}, 
  'say',  React.createElement( 'span',  {color: 'red'},  'hello' )
)


ReactDOM.render( element, document.getElementById('root') )