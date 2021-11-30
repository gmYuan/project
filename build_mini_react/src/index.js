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
//S15 useReducer实现 -- 见101 useReducer.js代码
function reducer(state,action){
  switch(action.type){
    case 'ADD':
      return { number: state.number+1 }
    case 'MINUS':
      return { number: state.number-1}
    default:
      return state
  }
}

function Counter() {
 const [state,dispatch] = React.useReducer( reducer, {number: 0} )
 return (
   <div>
     <p>{state.number}</p>
     <button onClick={ ()=>dispatch( {type:"ADD"} ) }>+</button>
     <button onClick={ ()=>dispatch( {type:"MINUS"} ) }>-</button>
   </div>
 )
}
const element15 = <Counter />

ReactDOM.render( element15,  document.getElementById('root'))