import React,{Component} from 'react';
import {Layout,Form,Input,Radio,Cascader,Select,AutoComplete,Checkbox,Button,message,Row,Col} from 'antd';
import styled from 'styled-components';
import {connect} from 'dva';//react-redux 是用来连接仓库和组件
import addresses from '../../utils/addresses';
import getFieldItems from '../../utils/getFieldItems';
const captchaUrl=`http://127.0.0.1:7001/api/captcha?ts=`;
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
const {Option} = Select;
class Login extends Component{
    changeLoginStatus = ()=>{
        this.props.dispatch({
            type:'login/save',
            payload:{isLogin:!this.props.isLogin}
        });
    }
    handleSubmit = (event)=>{
        event.preventDefault();
        this.loginForm.props.form.validateFields((error,values)=>{
            if(error){
                message.error(error);
            }else{
                this.props.dispatch({
                    type:this.props.isLogin?'login/signin':'login/signup',
                    payload:values
                });
            }
        });
    }
   render(){
       return (
           <Layout>
            <Content>
              <LoginForm
                 isLogin={this.props.isLogin}
                 handleSubmit={this.handleSubmit}
                 changeLoginStatus={this.changeLoginStatus}
                 wrappedComponentRef={inst=>this.loginForm = inst}
              />
            </Content>
           </Layout>
       )
   }
}
class LoginForm extends Component{
    state ={gender:1,autoCompleteResult:[],repasswordDirty:false}
    handleWebsiteChange = (value)=>{//1 [1.com,1.cn,1.org]
      let autoCompleteResult=[];
      if(value){
        autoCompleteResult = [".com",".cn",".org"].map(domain=>value+domain);
      }
      this.setState({autoCompleteResult});
    }
    compareWithRepassword = (rule,value,callback)=>{
        const form = this.props.form;
        if(value&& this.state.repasswordDirty){
            form.validateFields(['repassword'],{force:true});
        }
        callback();
    }
    compareWithPassword = (rule,value,callback)=>{//自定义校验器 规则 最新的值 回调
       const form = this.props.form;
       if(value && value !== form.getFieldValue('password')){
            callback('密码和确认密码不一致');
       }else{
           callback();
       }
    }
    repasswordChange = (event)=>{
        this.setState({repasswordDirty:this.state.repasswordDirty||event.target.value.length>0});
    }
    refreshCaptcha = (event)=>{
        event.target.src = captchaUrl+Date.now();
    }
    render(){
        //一旦把组件用Form.create包裹
        let {form:{getFieldDecorator},isLogin,handleSubmit} = this.props;
        let formTailItemLayout = {
            wrapperCol:{offset:4,span:20}
        }
        let countrySelector = getFieldDecorator('prefix',{
            initialValue:'086'
        })(
            <Select style={{width:70}}>
                <Option value="086">086</Option>
                <Option value="087">087</Option>
                <Option value="088">088</Option>
            </Select>
        );
        let websiteOptions = this.state.autoCompleteResult.map(item=>(
            <AutoComplete.Option key={item}>{item}</AutoComplete.Option>
        ));
         let websiteField = (
        <AutoComplete onChange={this.handleWebsiteChange}>
                               {websiteOptions}
        </AutoComplete>
        )
        let genderField = (
            <Radio.Group >
                    <Radio value={1}>男</Radio>
                    <Radio value={0}>女</Radio>
            </Radio.Group>
        )
        let filedItems = getFieldItems(getFieldDecorator,[
            //username password repassword email gender address phone website agreement
            {visible:true,label:"用户名",name:"username",required:true,input:<Input/>},
            {visible:true,label:"密码",name:"password",required:true,input:<Input onChange={this.repasswordChange}/>,rules:[
                {validator:this.compareWithRepassword},
                {min:3,message:'密码长度最短3位'},
                {max:8,message:'密码长度最长8位'}
            ]},
            {visible:!isLogin,label:"确认密码",name:"repassword",required:false,input:<Input/>,rules:[
                {validator:this.compareWithPassword}
            ]},
            {visible:!isLogin,label:"邮箱",name:"email",required:true,input:<Input/>,rules:[{type:'email',message:'必须输入一个合法的邮箱!'}]},
            {visible:!isLogin,label:"性别",name:"gender",required:true,input:genderField,extra:{initialValue:1}},
            {visible:!isLogin,label:"住址",name:"address",required:true,input:<Cascader options={addresses}/>},
            {visible:!isLogin,label:"手机号",name:"phone",required:true,rules:[{pattern:/^1\d{10}$/,message:'请输入合法手机号'}],input:<Input addonBefore={countrySelector} style={{width:'100%'}}/>},
            {visible:!isLogin,label:"网址",name:"website",input:websiteField},
            {visible:!isLogin,name:"agreement",layout:formTailItemLayout,input:<Checkbox>我已经同意本协议</Checkbox>,extra:{valuePropName:'checked'}}
        ]);
        return (
            <FormWrapper>
                <Form style={{width:'500px'}} onSubmit={handleSubmit}>
                    <h3>欢迎{isLogin?"登录":"注册"}</h3>
                     {filedItems}
                     <FormItem>
                        <Row>
                         <Col span={12}>
                            {
                                getFieldDecorator('captcha',{
                                    rules:[{required:true,message:"验证码必须输入"}]
                                })(<Input/>)
                            }
                         </Col>
                         <Col span={12}>
                            <img src={captchaUrl} onClick={this.refreshCaptcha}/>
                         </Col>
                        </Row>
                     </FormItem>
                     <FormItem>
                       <Button type="primary" htmlType="submit" style={{width:'100%'}}>{isLogin?"登录":"注册"}</Button>
                        {isLogin?"没有账号":"已有账号"}?<a href="#" onClick={this.props.changeLoginStatus}>立刻{isLogin?"注册":"登录"}</a>
                    </FormItem>
                </Form>
            </FormWrapper>
        )
    }
}
LoginForm  = Form.create()(LoginForm);
const FormWrapper = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  height:calc(100vh - 70px );
  h3{
      text-align:center;
  }
  form{
      border:1px solid #999;
      border-radius:5px;
      padding:20px;
  }
`
//一般来说在dva里，一个页面路由组件会对应一个子状态 login
export default connect(
    state=>state.login
)(Login);
