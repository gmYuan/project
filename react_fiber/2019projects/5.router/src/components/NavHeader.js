import React from 'react';
import {Route,Link,withRouter} from '../react-router-dom';
class NavHeader extends React.Component{
  render(){
      return (
          <div className="navbar-header">
              <a className="navbar-brand" onClick={()=>{
                  this.props.history.push('/');
              }}>珠峰架构</a>
          </div>
      )
  }
}

export  default  withRouter(NavHeader);