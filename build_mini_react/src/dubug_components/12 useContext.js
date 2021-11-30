import React from 'react';
import ReactDOM from 'react-dom';

let CounterContext = React.createContext()
function reducer(state,action){
   switch(action.type){
     case 'ADD':
       return {number:state.number+1};
     case 'MINUS':
       return {number:state.number-1};  
     default:
       return state;  
   }
}

function App(){
  const [state,dispatch] = React.useReducer(reducer,{number:0});
  return (
   <CounterContext.Provider value={ {state, dispatch} }>
     <Counter/>
   </CounterContext.Provider>
  )
}


function Counter(){
  let { state,dispatch } = React.useContext(CounterContext)
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={ ()=>dispatch( {type:"ADD"} ) }>+</button>
      <button onClick={ ()=>dispatch( {type:"MINUS"} ) }>-</button>
    </div>
  )
}

ReactDOM.render(
<App />
, document.getElementById('root'));