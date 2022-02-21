import React from 'react';
import {Link} from '../react-router-dom';
export  default class Login extends React.Component{
  state = {users:[]}
  handleLogin = ()=>{
    localStorage.setItem('logined',true);
    let from = this.props.location.state&&this.props.location.state.from;
    if(from){
      this.props.history.push(from);
    }else{
       this.props.history.push('/');
    }
  }
  render(){
      return (
        <button className="btn btn-primary" onClick={this.handleLogin}>登录</button>
      )
  }
}