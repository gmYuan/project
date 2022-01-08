import React from 'react';
import { Link, Route } from "../react-router-dom";
import UserList from './UserList';
import UserAdd from './UserAdd';
import UserDetail from './UserDetail';

class User extends React.Component{
    //   constructor(props) {
    //       super(props)
    //   }

    handleChange =  (type) =>  {
        console.log('type', type, this.props)
        this.props.history.push(`/${type}`)
    }

    render(){
        return (
            <div>
                {/* <ul>
                    <li onClick={() => this.handleChange('')}>home</li>
                    <li onClick={() => this.handleChange('user')}>user</li>
                    <li onClick={() => this.handleChange('profile')}>profile</li>
                </ul> */}
                {/* <div>User</div> */}

                {/* Link使用 */}
                {/* <Link to={ {pathname: '/user/detail', state:{id: 1, name: '章三'} } }> 
                    User1 
                </Link> */}


                <ul>
                  <li><Link to="/user/list" >用户列表</Link></li>
                  <li><Link to="/user/add">添加用户</Link></li>
                </ul>
                <Route path="/user/list" component={UserList}/>
                <Route path="/user/add" component={UserAdd}/>
                <Route path="/user/detail/:id" component={UserDetail}/>

            </div>
        )
    }
}
export default User;