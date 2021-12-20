import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import Home from '../components/Home'
import User from '../components/User'
import Profile from '../components/Profile'


const element20  = 
<Router>
    <Route path="/" exact  component={Home} />
    <Route path="/user" component={User} />
    <Route path="/profile" component={Profile} />
</Router>


ReactDOM.render( element20,  document.getElementById('root'))