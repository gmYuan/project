import React from 'react';
import {connect} from '../react-redux';
import {createSelector} from 'reselect';
import actions from '../store/actions/counter';

class Counter extends React.Component{
    render(){
        return (
            <div>
                <p>{this.props.number}</p>
                <button onClick={this.props.add}>+</button>
                 <button onClick={this.props.minus}>-</button>
            </div>
        )
    }
}
const counterSelector = state=>state.counter1;

let getCounterSelector = createSelector(counterSelector,counter1=>counter1);

const mapStateToProps = state=>getCounterSelector(state);

export default connect(
    mapStateToProps,
    actions
)(Counter)