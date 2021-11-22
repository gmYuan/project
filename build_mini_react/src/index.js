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


// ---------------------
// S8 context的实现---- 见03 context.js代码内容

let ThemeContext = React.createContext()
//ThemeContext={ Provider,Consumer } Consumer一般用在函数组件中
//contextType只能用在类组件里, Consumer可以在类组件和函数组件中使用

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: 'red' };
  }
  changeColor = (color) => {
    this.setState({ color });
  }
  render() {
    let contextValue = { color: this.state.color, changeColor: this.changeColor };
    return (
      <ThemeContext.Provider value={contextValue}>
        <div style={{ margin: '10px', border: `5px solid ${this.state.color}`, padding: '5px', width: '200px' }}>
          主页
           <Header />
          <Main />
        </div>
      </ThemeContext.Provider>
    )
  }
}

function Header(){
  return (
    <ThemeContext.Consumer>
      {
        value=>(
          <div style={{ margin: '10px', border: `5px solid ${value.color}`, padding: '5px' }}>
            头部
            <Title />
          </div>
        )
      }
    </ThemeContext.Consumer>
  )
}
class Title extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div style={{ margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px' }}>
        标题
      </div>
    )
  }
}

class Main extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div style={{ margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px' }}>
        主体
        <Content />
      </div>
    )
  }
}
class Content extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div style={{ margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px'}}>
        内容
        <button onClick={()=>this.context.changeColor('red')}>变红</button>
        <button onClick={()=>this.context.changeColor('green')}>变绿</button>
      </div>
    )
  }
}
const element8 = <Page />



ReactDOM.render( element8,  document.getElementById('root'))