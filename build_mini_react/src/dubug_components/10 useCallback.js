import React from 'react';
import ReactDOM from 'react-dom';

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


ReactDOM.render( <element14 />, document.getElementById('root'));
