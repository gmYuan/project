import React from 'react';
import ReactDOM from 'react-dom';
import store from '../store';
import actions from '../store/actions/counter1';
import {connect} from '../react-redux-old';
import PureComponent from './PureComponent';
class Counter1 extends PureComponent{
  render(){
     console.log('Counter1 render')
    return (
      <div style={{border:'1px solid red'}}>
         <p>{this.props.number}</p>
         <button onClick={this.props.add}>+</button>
         <button onClick={this.props.minus}>-</button>
      </div>
    )
  }
}
//把状态对象映射为属性对象 1.使用起来更简单了 2.减少了无用的渲染,这个组件派发组件，只会修改某一个
//子状态，然后只会引发这个子状态关联的组件刷新
let mapStateToProps = state=>state.counter1;
let mapDispatchToProps = (dispatch,ownProps) => ({
  add(){
    dispatch({type:'ADD1',payload:ownProps.amount});
  },
  minus(){
    dispatch({type:'MINUS1'});
  }
})
//柯里化 actions动作输出 
export default connect(mapStateToProps,mapDispatchToProps)(Counter1);