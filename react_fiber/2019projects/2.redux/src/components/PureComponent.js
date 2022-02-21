import React from 'react';
class PureComponent extends React.Component{
    static isPureComponent=true
    //询问组件是否需要刷新 下一个新属性 下一个新状态
    shouldComponentUpdate(nextProps,nextState){
       let oldProps = this.props;
       if(oldProps===null || typeof oldProps !=='object'||nextProps===null || typeof nextProps !=='object'){
           return true;
       }
       if(Object.keys(oldProps).length !== Object.keys(nextProps).length){
          return true;
       }
       //immutable.js
       for(let oldKey in oldProps){
           if(!nextProps.hasOwnProperty(oldKey) || nextProps[oldKey]!==oldProps[oldKey]){
               return true;
           }
       }
       return false;
    }
}
export default PureComponent;