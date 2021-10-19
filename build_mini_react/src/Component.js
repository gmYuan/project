import { findDOM, compareTwoVdom } from './react-dom';


class Updater {
  constructor(classInstance){
    this.classInstance = classInstance
    //保存将要更新的队列
    this.pendingStates = []
    //保存将要执行的回调函数
    this.callbacks = [] 
  }

  addState(partialState,callback){
    this.pendingStates.push(partialState)
    if (typeof callback ==='function') {
      this.callbacks.push(callback)
    }
    //触发更新逻辑       
    this.emitUpdate()
  }
  //不管状态和属性的变化 都会让组件刷新，即都会执行此方法
  emitUpdate(){
    this.updateComponent()
  }

  updateComponent(){
    let { classInstance, pendingStates } = this
    if (pendingStates.length > 0){//如果有等待的更新的话
      shouldUpdate(classInstance, this.getState())
    }
  }

  //根据老状态，和pendingStates这个更新队列，计算新状态
  getState(){
    let { classInstance, pendingStates } = this
    let { state } = classInstance  //先获取老的原始的组件状态
    pendingStates.forEach(nextState=>{
      if ( typeof nextState === 'function' )  {
        nextState= nextState(state)
      }  
      state = {...state,...nextState}
    })
    
    pendingStates.length = 0 //清空等待更新的队列
    this.callbacks.forEach(callback=>callback())
    this.callbacks.length=0
    //返回新状态
    return state
  }
}

// shouldUpdate
function shouldUpdate( classInstance, nextState ){
  classInstance.state = nextState
  classInstance.forceUpdate()  //然后调用类组件实例的updateComponent进行更新
}

export class Component {

  // 当子类继承父类的时候 ，父类的静态属性也是可以继承的
  static isReactComponent = true
  constructor (props) {
    this.props = props
    this.state = {}
    this.updater = new Updater(this)
  }

  setState(partialState, callback) {
    this.updater.addState(partialState, callback)
  }
  
  //根据新的属性状态计算新的要渲染的虚拟DOM
  forceUpdate() {
    //上一次类组件render方法计算得到的虚拟DOM
    let oldRenderVdom = this.oldRenderVdom
    //获取 oldRenderVdom对应的真实DOM
    let oldDOM = findDOM(oldRenderVdom)

    //然后基于新的属性和状态，计算新的虚拟DOM
    let newRenderVdom = this.render()

    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom)
    this.oldRenderVdom = newRenderVdom
  }

}
