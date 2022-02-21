import React from 'react';
/**
  写一个函数，然后参数是一个组件
  高阶组件用来解决组件间的逻辑复用问题
  高阶 高阶函数 函数可以作为函数的参数或者返回值，这就叫同阶函数
  高阶 高阶组件 组件可以作为函数的参数或者返回值，这就叫同阶组件
 */
function withLogger(WrappedComponent){
  return class extends React.Component{
      componentWillMount(){
          this.start = Date.now();
      }
      componentDidMount(){
          console.log(`此组件渲染一共花了${Date.now()-this.start}ms`);
      }
      render(){
          return <WrappedComponent/>
      }
  };
}
let Hello = ()=><div>hello</div>;
Hello = withLogger(Hello);
export default Hello;