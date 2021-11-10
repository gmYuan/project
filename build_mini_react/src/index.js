import React from 'react';
import ReactDOM from 'react-dom';

// S1 原生组件
// let element = React.createElement("h1", 
//   {
//     key: "h1",
//     className: "box",
//     style: {
//       color: 'red'
//     }
//   }, 
//   React.createElement("span", { key: "span1"}, "hello", 
//     React.createElement("span", { key: "span1-child2" } , "--")
//   ), 
//   React.createElement("span",  { key: "span2"}, "world")
// )
// ------------------------------------------


// S2 自定义 函数组件
// function FnCom(props) {
//   return <h1 className='box'><span>hello,</span>{props.name}</h1>
// }
// const element2 = <FnCom name='test' />
// --------------------------------------------


// S3 自定义 类组件的渲染
// class ClassCom extends React.Component {
//   render() {
//     return (
//       <h1 className="box"><span>hello,</span>{this.props.name}</h1>
//     )
//   }
// }
// const element3 = <ClassCom name="world"/>
// ----------------------------------------------


// S4 自定义类组件的更新
// class Counter extends React.Component {
//   state = {number: 0 }
//   handleClick = (e) => {
//     this.setState({number: this.state.number + 1}, () => {
//       console.log('cb2', this.state.number)
//     })
//     console.log('handleClick', this.state.number)
//   }

//   render() {
//     return (
//       // <div>
//       //   {this.state.number}
//       //   <ChildFnCom handleClick={this.handleClick} />
//       // </div>

//       <ChildFnCom number={this.state.number} handleClick={this.handleClick} />
      
//     )
//   }
// }

// function ChildFnCom({handleClick, number}) {
//   return(
//       // <button onClick={handleClick}> + </button>

//       // 用于测试findDom
//       <div>
//       {number}
//       <button onClick={handleClick}> + </button>
//       </div>
//   )
// }

// const element4 = <Counter />


// ---------------------
// S5 类组件的合成事件 + 批量更新机制
// class Counter extends React.Component {
//   state = {number: 0 }
//   handleClick = () => {
//     this.setState({number: this.state.number + 1}, () => {
//       console.log('回调1', this.state.number)
//     })
//     console.log('handleClick1', this.state.number)

//     this.setState({number: this.state.number + 1},  () => {
//       console.log('回调2', this.state.number)
//     })
//     console.log('handleClick2', this.state.number)

//     setTimeout(() => {
//       this.setState({number: this.state.number + 1})
//       console.log('handleClick3', this.state.number)
//       this.setState({number: this.state.number + 1})
//       console.log('handleClick4', this.state.number)
//     }, 10);
//   }

//   render() {
//     return (
//       <div>
//         {this.state.number}
//         <button onClick={this.handleClick}> + </button>
//       </div>
//     )
//   }
// }
// const element5 = <Counter />


// ---------------------
// S6 Ref的实现原理---- 见01 ref.js代码内容

// ---------------------
// S7 生命周期的实现---- 见02 生命周期.js代码内容
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

// function FunctionChildCounter(props){
//   return <div id="functionChildCounter">{props.count}</div>
// }

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
      <div id="Counter">
        <p> ParentCounter:{this.state.number} </p>
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
const element7 = <Counter />


ReactDOM.render( element7,  document.getElementById('root'))