import React from 'react';
import RouterContext from './context';
//老师，在render里跳转，然后再在setState不会有问题么？
export default class Redirect extends React.Component{
    static contextType = RouterContext;
    componentDidMount(){
        if(!this.props.from || this.props.from === this.context.location.pathname){
           this.context.history.push(this.props.to);
        }
    }
    render(){
        return null;
    }
}