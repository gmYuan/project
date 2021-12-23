import React from 'react';

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
                <ul>
                    <li onClick={() => this.handleChange('')}>home</li>
                    <li onClick={() => this.handleChange('user')}>user</li>
                    <li onClick={() => this.handleChange('profile')}>profile</li>
                </ul>
                <div>User</div>
            </div>
        )
    }
}
export default User;