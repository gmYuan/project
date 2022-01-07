import React from 'react';
import { Link } from "../react-router-dom";

class User extends React.Component{
  constructor(props) {
      super(props)
      console.log('初始化user')
  }

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

                <Link to={ {pathname: '/user/detail', state:{id: 1, name: '章三'} } }> 
                    User1 
                </Link>
            </div>
        )
    }
}
export default User;