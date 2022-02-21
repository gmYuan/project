import React from 'react';
import RouterContext from './context';
import pathToRegexp from 'path-to-regexp';
export default class Route extends React.Component{
   static contextType =  RouterContext;
   render(){
       //path=/user exact=false  访问/user  现在这种情况下exact=true
       let {path='/',exact=false,component:Component,render,children} = this.props;
       let {location} = this.context;
       let pathname = location.pathname;
       let paramNames = [];
       let regexp = pathToRegexp(path,paramNames,{end:exact});
       let result = pathname.match(regexp);
       let props = {
           location:this.context.location,
           history:this.context.history
       }
       if(result){//result=[配置的字符串，第一个分组，第二个分组....]
          // 对我们这个例子 url匹配到的路径 '/user/detail/1564280733415' values=['1564280733415']
           let [url,...values] = result;
           paramNames = paramNames.map(item=>item.name);//['id']
           let params = values.reduce((memo,value,index)=>{
               memo[paramNames[index]] = value;
               return memo;
           },{});
           let match = {
               path,
               exact:url===pathname,// /user=/user    /user=/user/add
               params,
               url:pathname
           }
           props.match = match;
           if(Component){
              return <Component {...props}/>;
           }else if(render){
              return render(props); 
           }else if(children){
             return children(props); 
           }
       }else if(children){
           return children(props);
       }else{
            return null;
       }
   }
}