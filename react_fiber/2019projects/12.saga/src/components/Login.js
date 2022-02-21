import React from 'react';
import {connect} from 'react-redux';
import actions from '../store/actions';
class Login extends React.Component{
    constructor(){
        super();
        this.nameRef = React.createRef();
        this.passRef = React.createRef();
    }
    login = (event)=>{
        event.preventDefault();
        let name = this.nameRef.current.value;
        let pass = this.passRef.current.value;
        this.props.login(name,pass);
    }
    logout = (event)=>{
         event.preventDefault();
       this.props.logout();
    }
    render(){
        let {token} = this.props;
        let loginForm = (
            <form>
                <label>用户名</label><input ref={this.nameRef}/>
                <label>密码</label><input ref={this.passRef}/>
                <button onClick={this.login}>登录</button>
                <button onClick={this.logout}>退出</button>
            </form>
        )
        let logoutForm = (
            <form>
                <p>当前已登录的用户名:{this.props.token}</p>
                <button onClick={this.logout}>退出</button>
            </form>
        )
        return (
            token?logoutForm:loginForm
        )
    }
}
export default connect(state=>state,actions)(Login);