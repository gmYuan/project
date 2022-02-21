import React from 'react';
import router from 'umi/router';
import Link from 'umi/link';
export default class UserDetail extends React.Component{
    state = {user:{}}
    componentDidMount(){
        let user = this.props.location.state;
        if(!user){
          let usersStr = localStorage.getItem('users');
          let users = usersStr?JSON.parse(usersStr):[];
          user = users.find(user=>user.id == this.props.match.params.id);
        }
        this.setState({user});
    }
    render(){
        console.log('this.props.location',this.props.location);
        let user = this.state.user;
        return (
           <div>
               <p>ID:{user.id}</p>
               <p>用户名:{user.username}</p>
           </div>
        )
    }
}