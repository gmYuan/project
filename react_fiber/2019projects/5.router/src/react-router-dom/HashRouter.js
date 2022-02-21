import React from 'react';
import RouterContext from './context';
export default class HashRouter extends React.Component{
    state = {
        location:{pathname:window.location.hash.slice(1)||'/',state:null}
    }
    componentWillMount(){
       this.listener = ()=>{
           this.setState({
               location:{
                   ...this.state.location,
                   pathname:window.location.hash.slice(1),
                   state:this.locationState
               }
           });
       };
       window.addEventListener('hashchange',this.listener); 
       window.location.hash = window.location.hash||'/';
    }
   componentWillUnmount(){
       window.removeEventListener('hashchange',this.listener);
   }
   render(){
       let that = this;
       let value = {
           location:that.state.location,
           history:{
               push(to){
                   if(that.block){
                       let allow = window.confirm(that.block(that.state.location));
                       if(!allow) return;
                   }
                   if(typeof to === 'object'){
                      let {pathname,state} = to; 
                      that.locationState = state;
                      window.location.hash = pathname;
                   }else{
                       window.location.hash = to;
                   }
               },
               block(message){
                   that.block = message;
               }
           }
       }
       return (
           <RouterContext.Provider value={value}>
             {this.props.children}
           </RouterContext.Provider>
       )
   }
}