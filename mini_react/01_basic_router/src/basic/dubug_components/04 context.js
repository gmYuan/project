import React from 'react';
import ReactDOM from 'react-dom';
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