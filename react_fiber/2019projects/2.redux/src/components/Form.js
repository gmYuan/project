import React from 'react';

class Form extends React.Component{
  render(){
      return (
          <form>
            <UserName/>
            <Password/>
          </form>
      )
  }
}
function fromLocal(WrappedComponent,key){
  return class extends React.Component{
      constructor(props){
        super(props);
        this.state = {value:''};
      }
      componentWillMount(){
        this.setState({
            value:localStorage.getItem(key)
        });
      }
      render(){//this.state.value = zhangsan
            return <WrappedComponent value={this.state.value} />
      }
  }
}
function fromAjax(WrappedComponent){
  return class extends React.Component{
      constructor(props){
        super(props);
        this.state = {value:''};
      }
      componentWillMount(){
          //一方面要从属性中取值到父组件传过来的属性值value
         let value = this.props.value;//username /username.json
         fetch(`/${value}.json`).then(res=>res.json()).then(result=>{
             console.log(result);
             this.setState({value:result.value});//result.value=张三
         });
      }
      render(){//WrappedComponent=UserName
            return <WrappedComponent value={this.state.value} />
      }
  }
}
class UserName extends React.Component{
    render(){
        return <>用户名:<input value={this.props.value} /></>
    }
}
UserName = fromAjax(UserName);
UserName = fromLocal(UserName,'username');

class Password extends React.Component{
    render(){
        return <>密码:<input value={this.props.value} onChange={this.props.handleChange}/></>
    }
}
Password = fromAjax(Password);
Password = fromLocal(Password,'password');
export default Form;