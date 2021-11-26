import React from './react';
import ReactDOM from './react-dom'

// renderProps实现
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
