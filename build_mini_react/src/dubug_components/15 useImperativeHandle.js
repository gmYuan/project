import React from 'react';
import ReactDOM from 'react-dom';

function Parent(){
  //let [number,setNumber]=React.useState();
  let inputRef = React.useRef();
  const getFocus = ()=>{
    inputRef.current.focus();
    inputRef.current.print();
  }
  return (
    <div>
      <ForwardChild ref={inputRef}/>
      <button onClick={getFocus}>焦点</button>
    </div>
  )
}

function Child(props,ref){
  const childRef = React.useRef();
  //函数组件自定义暴露给父组件ref对象
  React.useImperativeHandle(ref,()=>({
    focus(){
      childRef.current.focus();
    },
    print(){
      console.log('print');
    }
  }))
  return <input ref={childRef}/>
}
let ForwardChild = React.forwardRef(Child);

const element19 = <Parent />


ReactDOM.render( element19,  document.getElementById('root'))
