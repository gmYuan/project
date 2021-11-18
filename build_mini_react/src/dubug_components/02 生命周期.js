import React from './react';
import ReactDOM from './react-dom';

// ------------------------------------------
// S1 组件基本生命周期
class Counter extends React.Component{
  // 1.设置默认属性
  static defaultProps = {
    name:'珠峰架构'
  }

  constructor(props){
    super(props);
    this.state = {number:0};  //2.设置默认状态
    console.log('Parent 1.constructor');
  }
  componentWillMount(){
    console.log('Parent 2.componentWillMount');
  }
  handleClick = (event)=>{
    this.setState({number: this.state.number+1});
  }
  //setState会引起状态的变化,父组件更新的时候，会让子组件的属性发生变化
  //当属性或者状态发生改变的话，会走此方法来决定 是否要渲染更新
  shouldComponentUpdate(nextProps,nextState){
    console.log('Parent 5.shouldComponentUpdate');
    return nextState.number%2 === 0;//奇数不更新，偶数更新
  }
  componentWillUpdate(){
    console.log('Parent 6.componentWillUpdate');
  }
  render(){
    console.log('Parent 3.render');
    return (
      <div>
        <p>{this.props.name}:{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
  componentDidUpdate(){
    console.log('Parent 7.componentDidUpdate');
  }
  componentDidMount(){
    console.log('Parent 4.componentDidMount');
  }
}

const element7 = <Counter />
ReactDOM.render( element7,  document.getElementById('root'))


// ------------------------------------------
// S2  子组件的相关生命周期
class ChildCounter extends React.Component{
  // 1.设置默认属性
  static defaultProps = {
    name:'ChildCounter'
  }
  componentWillMount(){
    console.log('Child 1.componentWillMount');
  }
  render(){
    console.log('Child 2.render');
    return <div id="ChildCounter">ChildCounter:{this.props.count}</div>
  }
  componentDidMount(){
    console.log('Child 3.componentDidMount');
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log('Child 5 .shouldComponentUpdate');
    return nextProps.count%3 === 0   //如果是3的倍数就更新，否则不更新
  }
  componentWillReceiveProps(){
    console.log('Child 4.componentWillReceiveProps');
  }
  componentWillUnmount(){
    console.log('Child 6.componentWillUnmount');
  }
}

function FunctionChildCounter(props){
  return <div id="functionChildCounter">{props.count}</div>
}

class Counter extends React.Component{
  static defaultProps = {// 1.设置默认属性
    name:'Counter'
  }
  constructor(props){
    super(props);
    this.state = {number:0}   //2.设置默认状态
    console.log('Parent 1.constructor');
  }
  componentWillMount(){
    console.log('Parent 2.componentWillMount')
  }

  handleClick = (event)=>{
    this.setState( {number:this.state.number+1} )
  }

  //setState会引起状态的变化,父组件更新的时候，会让子组件的属性发生变化
  //当属性或者状态发生改变的话，会走此方法来决定 是否要渲染更新
  shouldComponentUpdate(nextProps, nextState){
    console.log('Parent 5.shouldComponentUpdate')
    return nextState.number%2 === 0   //奇数不更新，偶数更新
  }
  componentWillUpdate(){
    console.log('Parent 6.componentWillUpdate')
  }
  render(){
    console.log('Parent 3.render')
    return (
      <div id="Parent">
        {/* <p>ParentCounter:{this.state.number}</p> */}
        { this.state.number === 4 ? null : <ChildCounter count={this.state.number}/> }
        {/* <FunctionChildCounter count={this.state.number}/> */}
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
  componentDidUpdate(){
    console.log('Parent 7.componentDidUpdate');
  }
  componentDidMount(){
    console.log('Parent 4.componentDidMount');
  }
}
// debugger
const element7 = <Counter />


/** 
打印结果是

Parent 1.constructor
Parent 2.componentWillMount
Parent 3.render

Child 1.componentWillMount
Child 2.render
Child 3.componentDidMount

Parent 4.componentDidMount

--------------
state: 2

Parent 5.shouldComponentUpdate
Parent 6.componentWillUpdate
Parent 3.render

Child 4.componentWillReceiveProps
Child 5 .shouldComponentUpdate
Parent 7.componentDidUpdate

----------------
state: 4

Parent 5.shouldComponentUpdate
Parent 6.componentWillUpdate
Parent 3.render

Child 6.componentWillUnmount
Parent 7.componentDidUpdate

---------------
state: 6

Parent 5.shouldComponentUpdate
Parent 6.componentWillUpdate
Parent 3.render

Child 1.componentWillMount
Child 2.render
Child 3.componentDidMount

Parent 7.componentDidUpdate

**/


// ----------------------------------
// S3 getDerivedStateFromProps
class Child extends React.Component {
  state = { count:0 } 
  static defaultProps = {
    name:'Child'
  }
  //getDerivedStateFromProps是为了取代 componentWillReceiveProps
  //因为很多人在使用componentWillReceiveProps会调用this.setState，经常引起死循环
  static getDerivedStateFromProps(nextProps, prevState) {
    const {count} = nextProps;
    //return null  //不修改状态
    return { ...prevState , count:count*2 }   //新的状态对象
  }
  render(){
    console.log('Child1. render');
    return <div id="Child">Child:{this.state.count}</div>
  }
}
class Counter extends React.Component{
  static defaultProps = {// 1.设置默认属性
    name:'Parenr'
  }
  constructor(props){
    super(props)
    this.state = { number:0}
  }

  handleClick = (event)=>{
    this.setState({number:this.state.number+1})
  }
  render(){
    console.log('Parenr. render');
    return (
      <div id="Parent">
        <p>Counter:{this.state.number}</p>
        <Child count={this.state.number}/>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
