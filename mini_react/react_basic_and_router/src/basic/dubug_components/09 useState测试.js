import React from './react';
import ReactDOM from './react-dom'

function Counter(){
  let [number, setNumber] = React.useState('Counter-number1')
 
  let handleClick = ()=>{
    debugger
    setNumber(number+1)
  }

  return (
    <div>
      <p>{number}</p>
      <button onClick={handleClick}>+</button>
    </div>
  )
}

const element13 = <Counter />

ReactDOM.render(<element13 /> , document.getElementById('root'))