
import React from 'react';
import {connect} from 'react-redux';
import actions from '../store/actions/counter';
class Counter extends React.Component{
    handleGo = () => {
        debugger
        this.props.goto('/')
    }
  
    render(){
        console.log('Counter props', this.props);
        return (
            <div>
                <div>当前路径:{this.props.location.pathname}</div>
                <h1>Counter:{this.props.number}</h1>
                <button onClick={this.handleGo}>跳转到Home</button>
            </div>
        )
    }
}
let mapStateToProps = state=>(
    {
        ...state.counter,
        ...state.router
    }
);//{location,action}

export default connect(
    mapStateToProps,
    actions
)(Counter);