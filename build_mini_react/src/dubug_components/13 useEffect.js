import React from 'react';
import ReactDOM from 'react-dom'

function Counter(){
  const [number,setNumber] = React.useState(0)
  
  // effect函数会在当前的组件渲染到DOM 后执行
  React.useEffect ( ()=>{
    // debugger
    console.log('开启一个新的定时器')
    const timer = setInterval( ()=>{
      console.log('执行了定时器')
      setNumber(number+1)
      // setNumber(number => number+1)
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
      console.log('执行了定时器')
      setNumber(number+1)
    },1000)

    return ()=>{
      clearInterval(timer);
    } 
  }, [number])
  return <p>{number}</p>
}

const element17 = <Counter2 />







function Counter(){
  //源码里每一个虚拟DOM会有一个fiber
  //const [number,setNumber] = React.useState(0);
  //effect函数会在当前的组件渲染到DOM后执行
  React.useEffect(()=>{
    console.log('执行effect');
    return ()=>{//在执行下一次的effect之前要执行销毁函数
      console.log('销毁effect');
    }
   /*  console.log('开启一个新的定时器');
    const timer = setInterval(()=>{
      console.log('执行定时器',number);
      setNumber(number+1);
    },1000);
    return ()=>{//在执行下一次的effect之前要执行销毁函数
      console.log('清空定时器',number);
      clearInterval(timer);
    } */
  },[]);
  return <p>{0}</p>
}
function App(){
  const [visible,setVisible] = React.useState(true);
  return (
    <div>
      {visible?<Counter/>:null}
      <button onClick={()=>setVisible(false)}>hide</button>
    </div>
  )
}
ReactDOM.render(
<App />
, document.getElementById('root'));
