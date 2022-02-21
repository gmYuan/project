import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from './react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
import Authorized from './components/Authorized';
import Login from './components/Login';
import MenuLink from './components/MenuLink';
import NavHeader from './components/NavHeader';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render((
    <Router>
        <>
          <nav className="navbar navbar-inverse">
             <div className="fluid-contaier">
                <NavHeader/>
                <ul className="nav navbar-nav">
                    <li><MenuLink exact={true} to="/">首页</MenuLink></li>
                    <li><MenuLink to="/user">用户管理</MenuLink></li>
                    <li><MenuLink to="/profile">个人中心</MenuLink></li>
                </ul>
             </div>
          </nav>
          <div className="container">
            <div className="row">
                <div className="col-md-8 col-md-offset-2">
                    <Switch>
                        <Route exact={true} path="/" component={Home}/>
                        <Route path="/user" component={User}/>
                        <Route path="/login" component={Login}/>
                        <Authorized path="/profile" component={Profile}/>
                        <Redirect  to="/"/>
                    </Switch>
                </div>
            </div>
          </div>
        </>
      
       
    </Router>
), document.getElementById('root'));