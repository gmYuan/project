import React from 'react';
import RouterContext from './context';
(function(history){
    let oldPushState = history.pushState;
    history.pushState = function(state,title,path){
      oldPushState.call(history,state,title,path);
      window.onpushstate&&window.onpushstate(state,path);
    }
})(window.history);
export default class BrowserRouter extends React.Component{
    state = {
        location:{pathname:'/',state:null}
    }
    componentWillMount(){
      window.onpopstate = window.onpushstate =  (state,pathname)=>{
            this.setState({
               location:{
                   ...this.state.location,
                   pathname,
                   state
               }
           });
      }
    }
   componentWillUnmount(){
      
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
                     window.history.pushState(state,'',pathname);
                   }else{
                      window.history.pushState('','',to);
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