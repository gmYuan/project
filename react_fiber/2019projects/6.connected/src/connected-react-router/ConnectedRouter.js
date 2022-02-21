import React from 'react';
import {Router} from 'react-router';
import * as types from './constants';
import {ReactReduxContext} from 'react-redux';
//它的核心在于当路径发生改变的时候，会向仓库派发一个动作，告诉告诉仓库修改状态
export default class ConnectedRouter extends React.Component{
    static contextType = ReactReduxContext;
    componentDidMount(){
        this.unlisten = this.props.history.listen((location,action)=>{
            this.context.store.dispatch({
                type:types.LOCATION_CHNAGE,
                payload:{location,action}
            });
        });
    }
    componentWillUnmount(){
        this.unlisten();
    }
    render(){
        return (
            <Router history={this.props.history}>
                {this.props.children}
            </Router>
        )
    }
}