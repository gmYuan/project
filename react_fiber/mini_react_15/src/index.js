import React from './react';
import ReactDOM from './react-dom';

const onClick = () => { console.log('hello') }
let element = React.createElement( 
  'button', 
  {id: 'sayHello', onClick}, 
  'say',  React.createElement( 'span',  {color: 'red'},  'hello' )
)

ReactDOM.render( element, document.getElementById('root') )