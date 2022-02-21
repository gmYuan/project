import React,{Component} from 'react';
import {Menu,Icon} from 'antd';
import Link from 'umi/link';
import {connect} from 'dva';
const SubMenu = Menu.SubMenu;
class MenuList extends Component{
    renderMenuItems = (menus)=>{
        return menus.map(menu=>{
            if(menu.children &&menu.children.length>0){
                return (
                    <Menu.SubMenu key={menu.key} title={<span><Icon type={menu.icon}/>{menu.name}</span>}>
                        {this.renderMenuItems(menu.children)}
                    </Menu.SubMenu>
                )
            }else{
                return (
                    <Menu.Item key={menu.key}><Link to={menu.key}><Icon type={menu.icon}/>{menu.name}</Link></Menu.Item>
                )
            }
        });
    }
    render(){
        let user = this.props.user;
        if(!user){
            return null;
        }
        let pathname = window.location.pathname;
        let parent = pathname.split('/');
        parent.pop();
        parent = parent.join('/');
        return (
            <Menu
               style={{height:'calc(100vh - 128px)'}}
               theme="dark"
               defaultSelectedKeys = {[pathname]}
               defaultOpenKeys={[parent]}
               mode="inline"
            >
               {this.renderMenuItems(user.menus)}
            </Menu>
        )
    }
}

export default connect(state=>state.login)(MenuList);