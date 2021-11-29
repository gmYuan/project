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
function Child({data,handleClick}) {
  console.log('Child render')
  return <button onClick={handleClick}>{data.number}</button>
}
//可缓存的Child,如果一个组件它的属性没有变化，就不会重新渲染
let MemoChild = React.memo(Child)

function App(){
  console.log('App render')
  const [name,setName] = React.useState('zhufeng')
  const [number,setNumber] = React.useState(0)

  // 缓存对象的 第1个参数是创建对象的工厂函数，第2个参数是依赖变量的数组
  // 依赖数组中任何一个变量改变，就会重新调用工厂方法创建新的对象，否则就会重用上次对象
  // 如果不使用React.useMemo/React.useCallback 由于每次更新都会创新新的data/handleClick
  //  ==> 即使子组件使用了MemoChild， 也会导致子组件重复渲染
  let data = React.useMemo( () => ({number}), [number] )
  let handleClick = React.useCallback( ()=> setNumber(number+1), [number] )


  return (
    <div>
      <input type="text" value={name} onChange={event=>setName(event.target.value)}/>
      <MemoChild data={data} handleClick={handleClick}/>
    </div>
  )
}
const element14 = <App/>



ReactDOM.render( element14,  document.getElementById('root'))