import { findDOM, compareTwoVdom } from './react-dom';

export let updateQueue = {
  isBatchingUpdate:false,  //通过此变量来控制是否批量更新
  updaters: [],
  batchUpdate() {
    for(let updater of updateQueue.updaters){
      updater.updateComponent();
    }
    updateQueue.isBatchingUpdate=false;
    updateQueue.updaters.length=0;
  }
}


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
  emitUpdate(nextProps){
    this.nextProps  = nextProps;  //可能会传过来了一新的属性对象

    //如果当前处于批量更新模式，那么就把此updater实例添加到updateQueue里去
    if ( updateQueue.isBatchingUpdate ) {
      updateQueue.updaters.push(this)
    } else {
     this.updateComponent(); //让组件更新
    }
  }

  updateComponent(){
    let { classInstance, pendingStates, nextProps } = this
    if (nextProps || pendingStates.length > 0){//如果有等待的更新的话
      shouldUpdate(classInstance, nextProps, this.getState())
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
function shouldUpdate( classInstance, nextProps, nextState ){
  let willUpdate = true    //是否要更新，默认值是true
  if ( classInstance.shouldComponentUpdate 
    && 
    (!classInstance.shouldComponentUpdate(nextProps,nextState)) ) {
      willUpdate=false
  }
  // 生命周期
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate()
  }

  // 不管要不要更新视图，属性和状态的值 都要更新为最新的
  if (nextProps) classInstance.props = nextProps
  
  // getDerivedStateFromProps是类的静态方法
  // 所以使用 classInstance.constructor
  if (classInstance.constructor.getDerivedStateFromProps) {
    let nextState = classInstance.constructor.getDerivedStateFromProps(nextProps,classInstance.state);
    if(nextState){
      classInstance.state = nextState;
    }
  } else {
    classInstance.state = nextState   //永远指向最新的状态
  }
  if (willUpdate) {
    classInstance.forceUpdate()  //然后调用类组件实例的updateComponent进行更新
  }
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

    if (this.componentDidUpdate) {
      this.componentDidUpdate( this.props, this.state )
    } 
  }

}
