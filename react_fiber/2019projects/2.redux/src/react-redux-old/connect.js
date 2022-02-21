import React from 'react';
import {bindActionCreators} from '../redux';
import PropTypes from 'prop-types';
/**
此方法负责把组件和仓库进行关联，或者说进行连接
 */
export default function(mapStateToProps,actions){
   return function (WrappedComponent){
        return class extends React.Component{
            static contextTypes = {
                store:PropTypes.shape({
                    getState:PropTypes.func.isRequired,
                    subscribe:PropTypes.func.isRequired,
                    dispatch:PropTypes.func.isRequired
                })
            }
            constructor(props,context){
                super(props);
                //{counter1:{number:0},counter2:{number:0}}
                this.state = mapStateToProps(context.store.getState());
                if(typeof actions == 'function'){
                    this.boundActions = actions(context.store.dispatch,props);
                }else{
                    this.boundActions = bindActionCreators(actions,context.store.dispatch);
                } 
            }
            componentDidMount(){
                this.unsubscribe = this.context.store.subscribe(
                    ()=>this.setState(mapStateToProps(this.context.store.getState())));
            }
            componentWillUnmount(){
                this.unsubscribe();
            }
            render(){
                
                return <WrappedComponent {...this.state} {...this.boundActions}/>
            }
     }
   }  
}