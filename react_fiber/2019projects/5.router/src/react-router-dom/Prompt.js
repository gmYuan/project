import React from 'react';
import RouterContext from './context';
export default class Propmt extends React.Component{
    static contextType = RouterContext;
    componentWillUnmount(){
        this.context.history.block(null);
    }
    render(){
        let history = this.context.history;
        let {when,message} = this.props;
        if(when){
            history.block(message);
        }else{
            history.block(null);
        }
        return null;
    }
}