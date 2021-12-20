import React from './react';
import ReactDOM from './react-dom';

// 原生类型的 ref
class Sum extends React.Component{
  numberA
  numberB
  result
  constructor(props){
    super(props);
    this.numberA = React.createRef();  //{current:null}
    this.numberB = React.createRef();
    this.result = React.createRef();
  }
  handleClick = (event)=>{
    let numberA = this.numberA.current.value;
    let numberB = this.numberB.current.value;
    this.result.current.value = parseFloat(numberA)+parseFloat(numberB);
  }
  render(){
    return (
      <>
        <input ref={this.numberA}/>
        <input ref={this.numberB}/>
        <button onClick={this.handleClick}>+</button>
        <input ref={this.result}/>
      </>
    )
  }
}
const element5 = <Sum />
ReactDOM.render( element5,  document.getElementById('root'))

// --------------------
// 类组件ref
class TextInput extends React.Component{
  constructor(props){
    super(props);
    this.inputRef = React.createRef();
  }
  getTextInputFocus = ()=>{
    this.inputRef.current.focus();
  }
  render(){
    return <input ref={this.inputRef}/>
  }
}

class Form extends React.Component{
  constructor(props){
    super(props);
    this.textInputRef = React.createRef();
  }
  getFormFocus = ()=>{
    //this.textInputRef.current就会指向TextInput类组件的实例
    this.textInputRef.current.getTextInputFocus();
  }
  render(){
    return (
      <>
        <TextInput ref={this.textInputRef} />
        <button onClick={this.getFormFocus}>获得焦点</button>
      </>
    )
  }
}
const element6 = <Form />


// -------------------------
// 函数组件ref
function TextInput(props,ref){
  return <input ref={ref}/>
}
const ForwardedTextInput = React.forwardRef(TextInput);

class Form extends React.Component{
  constructor(props){
    super(props);
    this.textInputRef = React.createRef();
  }
  getFormFocus = ()=>{
    //this.textInputRef.current就会指向TextInput类组件的实例
    this.textInputRef.current.focus();
  }
  render(){
    return (
      <>
        <ForwardedTextInput ref={this.textInputRef}/>
        <button onClick={this.getFormFocus}>获得焦点</button>
      </>
    )
  }
}
