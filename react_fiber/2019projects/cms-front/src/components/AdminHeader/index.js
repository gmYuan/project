import React,{Component,Fragment} from 'react';
import {Layout} from 'antd';
import {connect} from 'dva';
import styles from  './index.less'
const {Header,Footer,Sider,Content} = Layout;
class AdminHeader extends Component{
    componentDidMount(){
        this.props.dispatch({type:'login/loadUser'});
    }
    render(){
        return (
            <Header>
                <img className={styles.logo} src={"http://img.zhufengpeixun.cn/zfpxlogo.png"}/>
                {this.props.user&&<span className={styles.welcome}>欢迎 {this.props.user.username}</span>}
            </Header>
        )
    }
}
export default connect(state=>state.login)(AdminHeader);