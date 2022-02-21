import React from 'react';
import {connect} from 'react-redux';
import actions from '../store/actions';
class Counter extends React.Component{
    render(){
        return (
            <>
               <p>{this.props.number}</p>
               <button onClick={this.props.add}>同步加1</button>
               <button onClick={this.props.thunkAdd}>thunk异步加1</button>
               <button onClick={this.props.sagaAdd}>saga异步加1</button>
            </>
        )
    }
}
export default connect(state=>state,actions)(Counter);