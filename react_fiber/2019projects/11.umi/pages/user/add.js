import React from 'react';
import router from 'umi/router';
export default class UserList extends React.Component{
    constructor(){
        super();
        this.usernameRef = React.createRef();
    }
    handleSubmit = (event)=>{
        event.preventDefault();
        let username = this.usernameRef.current.value;
        let usersStr = localStorage.getItem('users');
        let users = usersStr?JSON.parse(usersStr):[];
        users.push({id:Date.now(),username});
        localStorage.setItem('users',JSON.stringify(users));
        router.push('/user/list');
    }
    render(){
        return (
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">用户名</label>
                <input className="form-control" ref={this.usernameRef}/>
              </div>
             <div className="form-group">
                <input className="btn btn-primary" type="submit" defaultValue="添加用户"/>
              </div>
            </form>
        )
    }
}