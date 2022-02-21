import React,{Component} from 'react';
import {connect} from 'dva';
import qs from 'querystring';
import {Table,Form,Card,Button,Modal,Input,message,Popconfirm,Tree,Transfer} from 'antd';
import {PAGE_SIZE} from './constants';
import {routerRedux} from 'dva/router';
const FormItem = Form.Item;
const ENTITY = 'role';
const TreeNode = Tree.TreeNode;
export default 
@connect(state=>({...state[ENTITY],loading:state.loading.models[ENTITY]}))
class Page extends Component{
  save(payload){
      this.props.dispatch({type:`${ENTITY}/save`,payload});
  }  
  onEdit=(record)=>{ //编辑
    this.save({editVisible:true,record,isCreate:false});
  }
  onEditCancel=()=>{
      this.save({editVisible:false});
  }
  onEditOk = ()=>{
      this.editForm.props.form.validateFields((error,values)=>{
          if(error){
              return message.error(error);
          }else{
              this.props.dispatch({
                  type:this.props.isCreate?`${ENTITY}/create`:`${ENTITY}/update`,
                  payload:values
              });
          }
      });
  }
  onAdd=()=>{
      this.save({isCreate:true,editVisible:true});
  }
  onDel = (id)=>{
      this.props.dispatch({
          type:`${ENTITY}/del`,
          payload:id
      });
  }
  onDelAll = ()=>{
      this.props.dispatch({
          type:`${ENTITY}/delAll`,
          payload:this.props.selectedRowkeys
      });
  }
  onSearch = ()=>{
      this.searchForm.props.form.validateFields((error,values)=>{
          if(error){
              return message.error(error);
          }else{
              let where = Object.keys(values).reduce((memo,key)=>{
                  if(values[key]){
                      memo[key]=values[key];
                  }
                  return memo;
              },{});
              this.props.dispatch({
                  type:`${ENTITY}/search`,
                  payload:where
              });
          }
      });
  }
  onSetPermission = ()=>{
      if(this.props.selectedRows.length==1){
          let record = this.props.selectedRows[0];
          this.save({
              SetPermissionVisible:true,
              record,//当前的角色对象
              checkedKeys:record.resourceIds//此角色拥有的资源的ID数组
          });
      }else{
          message.error('为角色分配资源时只能选择一个角色!');
      }
  }
  onSetUsers = ()=>{
      if(this.props.selectedRows.length==1){
          let record = this.props.selectedRows[0];
          this.save({
              setUserVisible:true,
              record,//当前的角色对象
              targetKeys:record.userIds//此角色拥有的用户的ID数组
          });
      }else{
          message.error('为角色分配资源时只能选择一个角色!');
      }
  }
  onCheckPermission = (checkedKeys)=>{
      this.save({checkedKeys});
  }
  onSetUserChange = (targetKeys)=>{
      this.save({targetKeys});
  }
  setRolePermissionOk = ()=>{
      this.props.dispatch({
          type:'role/setRolePermission'
      });
  }
  setUserOk = ()=>{
      this.props.dispatch({
          type:'role/setRoleUser'
      });
  }
  render(){
      const columns = [
          {title:'名称',dataIndex:'name',key:'name'},
          {
              title:'操作',
              key:'operation',
              render:(value,record)=>(
                  <>
                     <Button style={{marginRight:10}} type="warning" onClick={()=>this.onEdit(record)}>编辑</Button> 
                     <Popconfirm
                       okText="确认"
                       cancelText="取消"
                       title="请问你确认删除吗?"
                       onConfirm={()=>this.onDel(record.id)}
                     >
                        <Button type="danger">删除</Button> 
                     </Popconfirm>
                  </>
              )
          }
      ]
      
     
      let {list,pageNum,total,isCreate,editVisible,record,selectedRowKeys,
      where,loading,resources,checkedKeys,SetPermissionVisible,targetKeys,users,setUserVisible} = this.props;
      const pagination = {//分页的选项对象
          current:pageNum,//当前页
          pageSize:PAGE_SIZE,
          showQuickJumper:true,
          showTotal:(total)=>{
              return `共计${total}行`;
          },
          total,//总计多少
          onChange:(pageNum)=>{//当点击新的页码的时候会把新的页码传过来
            /* this.props.dispatch(routerRedux.push({
                pathname:'/admin/user',// /admin/user?pageNum=1
                query:{pageNum}
            })); */
            let whereString = qs.stringify(this.props.where);
            this.props.dispatch(routerRedux.push(`/admin/${ENTITY}?pageNum=${pageNum}${whereString?('&'+whereString):''}`));
          }
      }
      let rowSelection = {
          type:'checkbox',
          selectedRowKeys,
          onChange:(selectedRowKeys,selectedRows)=>{
              this.save({selectedRowKeys,selectedRows});
          }
      }
      return (
        <>
         <Card>
            <SearchForm
             where={where}
             onSearch={this.onSearch}
             wrappedComponentRef={inst=>this.searchForm=inst}
            />
         </Card> 
         <Card>
             <Button type="primary" onClick={this.onAdd}>增加</Button>
             <Button style={{marginLeft:10}} type="danger" onClick={this.onDelAll}>全部删除</Button>
             <Button style={{marginLeft:10}} type="warning" onClick={this.onSetPermission}>设置资源权限</Button>
               <Button style={{marginLeft:10}} type="warning" onClick={this.onSetUsers}>设置用户</Button>
             <Table
                columns={columns}
                dataSource={list}
                rowKey={record=>record.id}
                pagination={pagination}
                rowSelection={rowSelection}
                loading={loading}
                onRow={
                    (record)=>{
                        return {
                            onClick:()=>{
                                let selectedRowKeys= this.props.selectedRowKeys;
                                let selectedRows= this.props.selectedRows;
                                let index = selectedRowKeys.indexOf(record.id);
                                if(index==-1){//原来没选中，要选 中，则要把行的ID添加数组里
                                    selectedRowKeys=[...selectedRowKeys,record.id];
                                    selectedRows=[...selectedRows,record];
                                }else{//原来选中，现在要改成未选中，则要把行的ID从数组中删除
                                    selectedRowKeys=selectedRowKeys.filter(id=>id!=record.id);
                                    selectedRows=selectedRows.filter(row=>row.id!=record.id);
                                }
                                this.save({selectedRowKeys,selectedRows});
                            }
                        }
                    }
                }
            />
            <EditModal
              wrappedComponentRef ={inst=>this.editForm=inst}
              isCreate={isCreate}
              visible={editVisible}
              onOk={this.onEditOk}
              onCancel={this.onEditCancel}
              record={record}
            />
            <PermissionModal
              visible={SetPermissionVisible}
              record={record}
              resources={resources}
              checkedKeys={checkedKeys}
              onCheck={this.onCheckPermission}
              onOk={this.setRolePermissionOk}
              onCancel={()=>this.save({SetPermissionVisible:false})}             
            />
           <SetUserModal
                        visible={setUserVisible}
                        record={record}
                        onOk={this.setUserOk}
                        targetKeys={targetKeys}
                        onChange={this.onSetUserChange}
                        users={users}
                        onCancel={() => this.save({ setUserVisible: false })}
/>

         </Card>
       </>  
      )
  }
}
 class SetUserModal extends Component {
    render() {
        let { visible, onOk, onCancel, record, targetKeys, onChange, users } = this.props;
        console.log('targetkeys',targetKeys);
        return (
            <Modal
                title={`为 ${record.name} 分配用户`}
                visible={visible}
                onOk={onOk}
                okText={"确定"}
                cancelText={"取消"}
                onCancel={onCancel}
                destroyOnClose
            >
                <Transfer
                    dataSource={users}
                    targetKeys={targetKeys}
                    titles={["待选用户", "已选用户"]}
                    onChange={onChange}
                    render={row => row.username}
                    rowKey={row => row.id}
                />
            </Modal>
        )
    }
}

class PermissionModal extends Component{
    renderResources = (resources=[])=>{
        return resources.map(resource=>{
            if(resource.children.length>0){
                return (
                    <TreeNode title={resource.name} key={resource.id}>
                        {this.renderResources(resource.children)}
                    </TreeNode>
                )
            }else{
                return <TreeNode  title={resource.name} key={resource.id}/>
            }
        });
    }
    render(){
        let {visible,record,resources=[],checkedKeys,onCheck,onOk,onCancel} = this.props;
        return (
            <Modal
             visible={visible}
             title="为角色分配资源"
             onOk={onOk}
             onCancel={onCancel}
             destroyOnClose
            >
                <Tree
                  checkable
                  defaultExpandAll
                  onCheck={onCheck}
                  checkedKeys={checkedKeys}
                >
                    {this.renderResources(resources)}
                </Tree>
            </Modal>
        )
    }
}
@Form.create()
class SearchForm extends Component{
  render(){
      let {form:{getFieldDecorator},where,onSearch} = this.props;
      return (
          <Form layout="inline">
             <Form.Item label="名称">
                    {
                        getFieldDecorator('name',{
                            initialValue:where.name
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item>
                    <Button onClick={onSearch} shape="circle" icon="search"/> 
                </Form.Item>
          </Form>
      )  
  }
}

@Form.create()
class EditModal extends Component{
   render(){
       let {form:{getFieldDecorator},isCreate,visible,record,onOk,onCancel} = this.props;
       return (
           <Modal
             title={isCreate?'新增':'编辑'}
             visible={visible}
             onOk={onOk}
             onCancel={onCancel}
             destroyOnClose
           >
             <Form>
                {
                        getFieldDecorator('id',{
                            initialValue:record.id
                        })(
                            <Input type="hidden"/>
                        )
                }
                <Form.Item label="名称">
                    {
                        getFieldDecorator('name',{
                            initialValue:record.username,
                            rules:[{required:true,message:'角色名必须输入!'}]
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
             </Form>
           </Modal>
       )
   }
}