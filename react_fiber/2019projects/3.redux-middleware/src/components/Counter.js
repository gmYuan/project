import React from 'react';
import {connect} from '../react-redux';
import actions from '../store/actions/counter';
export default @connect(
    state=>state.counter,
    actions
)
class Counter extends React.Component{
    render(){
        return (
            <div>
                <p>{this.props.number}</p>
                <button onClick={this.props.add}>+</button>
                <button onClick={this.props.asyncAdd}>async+</button>
                <button onClick={this.props.promiseAdd}>promise+</button>
            </div>
        )
    }
}