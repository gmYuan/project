import React from 'react';
import {Prompt,withPrompt} from '../react-router-dom';

class  UserAdd extends React.Component{
  constructor(){
    super();
    this.usernameRef = React.createRef();
  }
  handleSubmit = (event)=>{
    event.preventDefault();
    let username = this.usernameRef.current.value;
    let user = {id:Date.now(),username};
    let usersStr = localStorage.getItem('users');
    let users = usersStr?JSON.parse(usersStr):[];
    users.push(user);
    localStorage.setItem('users',JSON.stringify(users));
    // /user/list 用户列表 /user/add 添加用户 /user/detail/:id 用户详情页
    this.props.history.push('/user/list');
  }
  render(){
      return (
          <form onSubmit={this.handleSubmit}>
           
            <div className="form-group">
                <label>用户名</label>
                <input 
                onChange={event=>this.props.settle(event.target.value&&event.target.value.length>0,location=>`你是否要离开${location.pathname}`)}
                className="form-control" type="text" ref={this.usernameRef}/>
            </div>
            <div className="form-group">
                <input type="submit" className="btn btn-primary"/>
            </div>
          </form>
      )
  }
}
export  default withPrompt(UserAdd);