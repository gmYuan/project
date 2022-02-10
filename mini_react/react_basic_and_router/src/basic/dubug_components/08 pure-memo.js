import React from './react';
import ReactDOM from './react-dom'

// React.PureComponent
class SubCounter extends React.PureComponent{
  render(){
    console.log('SubCounter render')
    return <div>{this.props.count}</div>
  }
}
class Counter extends React.PureComponent{
  state = {number:0}
  inputRef = React.createRef();
   handleClick = (event)=>{
    let amount = Number(this.inputRef.current.value);
    this.setState({number:this.state.number+amount});
   }
   render(){
     console.log('Counter render')
     return (
      <div>
        <p>{this.state.number}</p>
        <input ref={this.inputRef}/>
        <button onClick={this.handleClick}>+</button>
        <SubCounter count={this.state.number}/>
      </div>
     )
   }
}

const element12 = <Counter />


// React.memo
function SubCounter(props){
  console.log('SubCounter render')
  return <div>{props.count}</div>
}

/*
 let MemoSubCounter = React.memo(SubCounter, (prevProps,nextProps)=>{
  return JSON.stringify(prevProps)=== JSON.stringify(nextProps)
})
*/
let MemoSubCounter = React.memo(SubCounter)
console.log('MemoSubCounter', MemoSubCounter)


class Counter extends React.Component{
  state = {number:0}
  inputRef = React.createRef();
   handleClick = (event)=>{
    let amount = Number(this.inputRef.current.value)
    this.setState({number:this.state.number+amount})
   }
   render(){
     console.log('Counter render');
     return (
      <div>
        <p>{this.state.number}</p>
        <input ref={this.inputRef}/>
        <button onClick={this.handleClick}>+</button>
        <MemoSubCounter count={this.state.number}/>
      </div>
     )
   }
}

const element12 = <Counter />



ReactDOM.render(<element12 />, document.getElementById('root'))




