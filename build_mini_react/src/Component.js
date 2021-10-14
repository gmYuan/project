

class Component {
  // 当子类继承父类的时候 ，父类的静态属性也是可以继承的
  static isReactComponent = true
  constructor (props) {
    this.props = props
    this.state = {}
    this.updater = new Updater(this)
  }

  setState(partialState) {
    this.updater.addState(partialState)
  }

  
}

export default Component