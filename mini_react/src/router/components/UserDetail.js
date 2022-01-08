import React, { Component } from 'react'
// import { UserAPI } from '../utils';

export default class UserDetail extends Component{
    // componentDidMount(){
    //     let user = this.props.location.state;
    //     if(!user){//如果不是从列表页跳转的，而是直接刷新的话，user就是undefined
    //         let id = this.props.match.params.id;
    //         user = UserAPI.find(id);
    //     }
    //     if(user)this.setState({user});
    // }
    render(){
        let user = this.props.location.state
        let history = this.props.match
        console.log('8888', user)
        console.log('999999', history)
        
        return (
            <div>
                <p>id:{user?.id}</p>
                <p>name:{user?.name}</p>
            </div>
        )
    }
}