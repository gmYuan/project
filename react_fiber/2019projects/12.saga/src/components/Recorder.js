import React from 'react';
import {connect} from 'react-redux';
import actions from '../store/actions';
class Recorder extends React.Component{
    render(){
        return (
            <>
               <p>{this.props.number}</p>
               <button onClick={this.props.stop}>停止</button>
            </>
        )
    }
}
export default connect(state=>state.recorder,actions)(Recorder);