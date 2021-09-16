import React from './react';
import ReactDOM from './react-dom';

// S1
// let element = React.createElement("h1", 
//   {
//     key: "h1",
//     className: "box",
//     style: {
//       color: 'red'
//     }
//   }, 
//   React.createElement("span", { key: "span1"}, "hello", 
//     React.createElement("span", { key: "span1-child2" } , "--")
//   ), 
//   React.createElement("span",  { key: "span2"}, "world")
// )


// S2
function FnCom(props) {
  return <h1 className='box'> <span>hello</span> {props.name} </h1>
}
const element = <FnCom name='test' />


ReactDOM.render( element, document.getElementById('root'))