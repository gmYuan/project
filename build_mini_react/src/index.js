import React from './react';
import ReactDOM from './react-dom';

// S1 vdom生成， 具体见 01 vdom渲染
// S2 组件的更新，具体见 01 vdom渲染
// S3 类组件的合成事件 + 批量更新机制，具体见 01 vdom渲染


// ---------------------
// S6 Ref的实现原理---- 见01 ref.js代码内容


// ---------------------
// S7 生命周期的实现---- 见02 生命周期.js代码内容


// ---------------------
// S8 context的实现---- 见03 context.js代码内容


// ---------------------
// S9 高阶组件实现---- 见05 高阶组件.js代码


// ---------------------
// S10 多个context实现---- 见06 多个context.js代码


//-------------------------
//S11 renderProps-----  见07 renderProps.js代码
  

//--------------------------------------------------------------
//S12 React.pureComponent / React.memo实现 ----- 见08 pure-memo.js代码


//---------------------------------------------
//S13 useState实现 -- 见09 useState测试.js代码


//---------------------------------------------
//S14 useCallback/useMemo实现 -- 见10 useCallback.js代码


//---------------------------------------------
//S15 useReducer实现 -- 见11 useReducer.js代码


//---------------------------------------
//S16 useContext实现 -- 见12 useContext.js代码


//---------------------------------------
//S17 useEffect实现 -- 见13 useEffect.js代码


//---------------------------------------
//S18 uselayoutEffect实现 -- 见14 uselayoutEffect.js代码


//--------------------------
//S19 useImperativeHandle实现-- 见15 useImperativeHandle.js代码

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