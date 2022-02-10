import React from './react';
import ReactDOM from './react-dom'

//高阶组件 两大用途 属性代理 反向继承
//高阶组件来自高阶函数

// 属性代理
const withLoading = (OldComponent)=>{
   return class extends React.Component{
    show = ()=>{
      let loading = document.createElement('div');
      loading.innerHTML = `<p id="loading" 
      style="position:absolute;top:100px;left:50%;z-index:10;background-color:gray">loading</p>`;
      document.body.appendChild(loading);
    }
    hide = ()=>{
      document.getElementById('loading').remove();
    }
    render(){
      return <OldComponent {...this.props} show={this.show} hide={this.hide}/>
    }
   }
}

class Panel extends React.Component{
  render(){
    return (
      <div>
        {this.props.title}
        <button onClick={this.props.show}>显示</button>
        <button onClick={this.props.hide}>隐藏</button>
      </div>
    )
  }
}
let LoadingPanel = withLoading(Panel)

const element9 = <LoadingPanel title="这是标题"/>
ReactDOM.render(element9, document.getElementById('root'))



// 反向继承
class AntdBtn extends React.Component{
  state = {name: '张三'}
  componentWillMount() {
    console.log('第三方组件的 willMount')
  }
  render(){
    console.log('第三方组件的  render')
    return (
      <button  name={this.state.name}>{this.props.title || '默认标题'}</button>
    )
  }
 }

const Wrapper = (OldComponent)=>{
  return class extends OldComponent {
    constructor(props) {
      super(props)
      this.state ={ ...this.state,  num: 0 }
    }

    componentWillMount() {
      console.log('反向继承的 willMount')
      super.componentWillMount()
    }

    handleClick = () =>{
      this.setState({num: this.state.num+1})
    }

   render(){
     console.log('反向继承的  render')
     let renderElement = super.render()
     let newProps = {...renderElement.props, onClick: this.handleClick}
     let cloneElement = React.cloneElement(renderElement, newProps, this.state.num)
     return cloneElement
   }
  }
}

let WrappedCom = Wrapper(AntdBtn)
const element10 = <WrappedCom title='我是反向标题啊' />
ReactDOM.render(element10, document.getElementById('root'))
