import React from 'react';
import Link from 'umi/link';
export default class Home extends React.Component{
    render(){
        return (
            <div>
              <Link to="/profile">跳转到个人中心</Link>
              首页3
            </div>
        )
    }
}