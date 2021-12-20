// import React from './basic/react';
// import ReactDOM from './basic/react-dom';
// S1 ~S19 见basic部分

// const element19 = <div>2222</div>
//-------------------------------------


import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from './router/react-router-dom';

import Home from './router/components/Home'
import User from './router/components/User'
import Profile from './router/components/Profile'


const element20  = 
<Router>
    <Route path="/" exact  component={Home} />
    <Route path="/user" component={User} />
    <Route path="/profile" component={Profile} />
</Router>


ReactDOM.render( element20,  document.getElementById('root'))