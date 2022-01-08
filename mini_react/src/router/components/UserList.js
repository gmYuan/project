import React, { Component } from 'react'
// import {UserAPI} from '../utils';
import {Link} from '../react-router-dom';

export default class UserList extends Component {
    state = {users:[]}
    // componentDidMount(){
    //     let users = UserAPI.list();
    //     this.setState({users});
    // }

    render() {
        return (
            <ul>
                <li>
                    <Link to={{pathname:`/user/detail/1`,state:{id: 1, name: '章三'} }}>章三</Link>
                </li>

                <li>
                <Link to={{pathname:`/user/detail/2`,state:{id: 2, name: '李四'} }}>李四</Link>
                </li>



                {/* {
                    this.state.users.map((user)=>(
                        <li key={user.id}>
                            <Link to={{pathname:`/user/detail/${user.id}`,state:user}}>{user.name}</Link>
                        </li>
                    ))
                } */}
            </ul>
        )
    }
}
