import React from 'react';
import {Route,Link} from '../react-router-dom';
import './MenuLink.css';
export  default class MenuLink extends React.Component{
  render(){
    //children不管路径是否匹配，都会渲染返回值，render只会在path和地址栏路径匹配的时候才渲染
    return (
      <Route exact={this.props.exact} path={this.props.to} children={props=>(
        <Link className={props.match?'active':''}  to={this.props.to}>{this.props.children}</Link>
      )}/>
    )
  }
}