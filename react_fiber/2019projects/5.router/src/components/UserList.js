import React from 'react';
import {Link} from '../react-router-dom';
export  default class UserAdd extends React.Component{
  state = {users:[]}
  componentDidMount(){
    let usersStr = localStorage.getItem('users');
    let users = usersStr?JSON.parse(usersStr):[];
    this.setState({users});
  }
  render(){
      return (
          <ul className="list-group">
            {
              this.state.users.map(item=>(
                <li className="list-group-item">
                <Link to={{pathname:`/user/detail/${item.id}`,state:item}}>{item.username}</Link>
                </li>
              ))
            }
          </ul>
      )
  }
}