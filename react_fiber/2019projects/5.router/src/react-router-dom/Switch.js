import React from 'react';
import RouterContext from './context';
import pathToRegexp from 'path-to-regexp';
export default class Switch extends React.Component{
    static contextType = RouterContext;
    render(){
        let children = Array.isArray(this.props.children)?this.props.children:[this.props.children];
        let pathname = this.context.location.pathname;
        for(let i=0;i<children.length;i++){
            let child = children[i];
            let {path="/",exact=false,component:Component} = child.props;
            let paramNames = [];
            let regexp = pathToRegexp(path,paramNames,{end:exact});
            let result = pathname.match(regexp);
            if(result){
                return child;
            }
        }
        return null;
    }
}