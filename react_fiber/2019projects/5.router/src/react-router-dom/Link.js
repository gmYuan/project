import React from 'react';
import RouterContext from './context';
export default class Link extends React.Component{
    static contextType = RouterContext;
    render(){
        return (
            <a {...this.props} href={`#${this.props.to}`} onClick={(event)=>{
                event.preventDefault();
                this.context.history.push(this.props.to)
            }} >{this.props.children}</a>
        )
    }
}