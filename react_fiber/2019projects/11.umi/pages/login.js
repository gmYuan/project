import React from 'react';
import router from 'umi/router';
export default class Profile extends React.Component{
    render(){
        return (
          <button onClick={()=>{
              localStorage.setItem('login',"true");
              if(this.props.location.state && this.props.location.state.from)
                 router.push(this.props.location.state.from);
              else
                 router.push('/');
          }}>登录</button>
        )
    }
}