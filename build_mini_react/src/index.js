import React from './react';
import ReactDOM from './react-dom';

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
const element7 = <Counter />



ReactDOM.render( element7,  document.getElementById('root'))