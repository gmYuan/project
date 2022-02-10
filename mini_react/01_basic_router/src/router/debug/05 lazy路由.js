// import React from './basic/react';
// import ReactDOM from './basic/react-dom';
// S1 ~S19 见basic部分

// const element19 = <div>2222</div>
//-------------------------------------

import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

let LazyHome = React.lazy(() => import('./router/components/Home.js'))
function SuspenseHome(){
  return (
    <React.Suspense fallback={<div>Loading</div>}>
      <LazyHome />
    </React.Suspense>
  )
}

let LazyProfile= React.lazy(() => import('./router/components/Profile'))
function SuspenseUser(){
  return (
    <React.Suspense fallback={<div>Loading</div>}>
      <LazyProfile />
    </React.Suspense>
  )
}

const element22  = 
<Router>
  <ul>
    <li><Link to="/">首页</Link></li>
    <li><Link to="/user">用户管理</Link></li>
  </ul>
  <Route exact path="/" component={SuspenseHome}/>
  <Route path="/user" component={SuspenseUser}/>
</Router>


ReactDOM.render( element22,  document.getElementById('root'))