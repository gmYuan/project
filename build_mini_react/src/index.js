import React from './react';
import ReactDOM from './react-dom';

// S1
let element = React.createElement("h1", 
  {
    className: "box",
    style: {
      color: 'red'
    }
  }, 
  React.createElement("span", null, "hello", 
    React.createElement("span", null, "--")
  ), 
  React.createElement("span", null, "world")
)


// S2
// function FnCom(props) {
//   return <h1 className='box'><span>hello</span>，{props.name}</h1>
// }
// const element = <FnCom name='ygm' />


ReactDOM.render( element, document.getElementById('root'))