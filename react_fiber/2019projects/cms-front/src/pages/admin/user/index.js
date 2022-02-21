import React,{Component} from 'react';
import {connect} from 'dva';
import qs from 'querystring';
import {Table,Form,Card,Button,Modal,Input,message,Popconfirm} from 'antd';
import {PAGE_SIZE} from './constants';
import {routerRedux} from 'dva/router';
const FormItem = Form.Item;
const ENTITY = 'user';
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
  render(){
      const columns = [
          {title:'用户名',dataIndex:'username',key:'username'},
          {title:'邮箱',dataIndex:'email',key:'email'},
          {title:'性别',dataIndex:'gender',key:'gender',render:(value,row)=>{
              return value===1?"男":"女";
          }},
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
      
     
      let {list,pageNum,total,isCreate,editVisible,record,selectedRowKeys,where,loading} = this.props;
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
            this.props.dispatch(routerRedux.push(`/admin/${ENTITY}?pageNum=${pageNum}&${whereString}`));
          }
      }
      let rowSelection = {
          type:'checkbox',
          selectedRowKeys,
          onChange:(selectedRowKeys)=>{
              this.save({selectedRowKeys});
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
                                let index = selectedRowKeys.indexOf(record.id);
                                if(index==-1){//原来没选中，要选 中，则要把行的ID添加数组里
                                    selectedRowKeys=[...selectedRowKeys,record.id];
                                }else{//原来选中，现在要改成未选中，则要把行的ID从数组中删除
                                    selectedRowKeys=selectedRowKeys.filter(id=>id!=record.id);
                                }
                                this.save({selectedRowKeys});
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
         </Card>
       </>  
      )
  }
}
@Form.create()
class SearchForm extends Component{
  render(){
      let {form:{getFieldDecorator},where,onSearch} = this.props;
      return (
          <Form layout="inline">
             <Form.Item label="用户名">
                    {
                        getFieldDecorator('username',{
                            initialValue:where.username
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="邮箱">
                    {
                        getFieldDecorator('email',{
                            initialValue:where.email
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
                <Form.Item label="用户名">
                    {
                        getFieldDecorator('username',{
                            initialValue:record.username,
                            rules:[{required:true,message:'用户名必须输入!'}]
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="邮箱">
                    {
                        getFieldDecorator('email',{
                            initialValue:record.email,
                            rules:[{required:true,message:'邮箱必须输入!'}]
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