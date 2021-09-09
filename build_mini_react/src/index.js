import React from './react';
import ReactDOM from './react-dom';

// S1
// let element = React.createElement("h1", {
//   className: 'box',
//   style: {
//     color: 'red'
//   } 
// }, "hello22")

// S2
function FnCom(props) {
  return <h1 className='box'> <span>hello</span>{props.name}   </h1>

  // return React.createElement("h1", {
  //   className: "box"
  // }, " ", React.createElement("span", null, "hello"), props.name, "   ");
}
const element = <FnCom name='ygm' />


ReactDOM.render( element, document.getElementById('root'))