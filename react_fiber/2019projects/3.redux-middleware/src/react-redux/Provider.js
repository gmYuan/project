import React from 'react';
import ReactReduxContext from './context';
//reactReduxContent{Provider,Consumer}
/**
1. 要从属性对象中取得store
2. 通过上下文传递给下级组件
 */
export default class extends React.Component{
    render(){
        return (
            <ReactReduxContext.Provider value={{store:this.props.store}}>
                {this.props.children}
            </ReactReduxContext.Provider>
        )
    }
}