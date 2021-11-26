import React from './react';
import ReactDOM from './react-dom';

// S1 vdom生成， 具体见 01 vdom渲染
// S2 组件的更新，具体见 01 vdom渲染
// S3 类组件的合成事件 + 批量更新机制，具体见 01 vdom渲染


// ---------------------
// S6 Ref的实现原理---- 见01 ref.js代码内容


// ---------------------
// S7 生命周期的实现---- 见02 生命周期.js代码内容


// ---------------------
// S8 context的实现---- 见03 context.js代码内容


// ---------------------
// S9 高阶组件实现---- 见05 高阶组件.js代码


// ---------------------
// S10 多个context实现---- 见06 多个context.js代码


//-------------------------
//S11 renderProps

class Tracker extends React.Component {
    state = { x: 0, y: 0 }
    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY
      })
    }
  
    render() {
      return (
        <div onMouseMove={this.handleMouseMove} style={{ height: '100vh' }}>
          { this.props.render(this.state) }
        </div>
      )
    }
  
  }
  
  function Cat({mouse}) {
    return (
        <div>
          Cat的位置是left-- {`${mouse.x}`}, top--{`${mouse.y}`}
      </div>
    )
  }
  
  
  class CatTracker extends React.Component {
    render() {
      return (
        <div>
          <Tracker 
            render = { mouse => ( <Cat mouse={mouse} /> ) }
          />
        </div>
      )
    }
  }
  const element11 = <CatTracker />





ReactDOM.render( element11,  document.getElementById('root'))