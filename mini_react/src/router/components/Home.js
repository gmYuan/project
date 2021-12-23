import React from 'react';

class Home extends React.Component{
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
                <div>Home</div>
            </div>
        )
    }
}
export default Home;