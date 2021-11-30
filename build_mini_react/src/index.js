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
function Counter(){
  const [number,setNumber] = React.useState(0)
  
  // effect函数会在当前的组件渲染到DOM 后执行
  React.useEffect ( ()=>{
    debugger
    console.log('开启一个新的定时器')
    const timer = setInterval( ()=>{
      console.log('执行了定时器', number)
      setNumber(number => number+1)
    },1000)

    return ()=>{
      clearInterval(timer);
    } 
  }, [])

  return <p>{number}</p>
}

function Counter2(){
  const [number,setNumber] = React.useState(0)
  
  React.useEffect ( ()=>{
    debugger
    console.log('开启一个新的定时器')
    const timer = setInterval( ()=>{
      setNumber(number+1)
    },1000)

    return ()=>{
      clearInterval(timer);
    } 
  }, [number])
  return <p>{number}</p>
}


// const element17 = <Counter />
const element17 = <Counter2 />




ReactDOM.render( element17,  document.getElementById('root'))