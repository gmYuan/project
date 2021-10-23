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
class Counter extends React.Component {
  state = {number: 0 }
  handleClick = (e) => {
    this.setState({number: this.state.number + 1}, () => {
      console.log('cb2', this.state.number)
    })
    console.log('handleClick', this.state.number)
  }

  render() {
    return (
      // <div>
      //   {this.state.number}
      //   <ChildFnCom handleClick={this.handleClick} />
      // </div>

      <ChildFnCom number={this.state.number} handleClick={this.handleClick} />
      
    )
  }
}

function ChildFnCom({handleClick, number}) {
  return(
      // <button onClick={handleClick}> + </button>

      // 用于测试findDom
      <div>
      {number}
      <button onClick={handleClick}> + </button>
      </div>
  )
}

// debugger
const element4 = <Counter />




ReactDOM.render( element4,  document.getElementById('root'))