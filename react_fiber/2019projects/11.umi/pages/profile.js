/**
 * title: 个人中心
 * Routes:
 *   - ./PrivateRoute.js
 */
import React from 'react';
import router from 'umi/router';
export default class Profile extends React.Component{
    render(){
        //router = react-router-dom history对象
        return (
            <div>
              个人中心
              <button onClick={()=>router.push('/')}>跳到首页去</button>
            </div>
        )
    }
}