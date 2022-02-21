import React from 'react';
import PropTypes from 'prop-types';
class Main extends React.Component{
     constructor(props){//pros属性对象 context 上下文对象
        super(props);
    }
    render(){
        return (
            <div style={{border:`5px solid ${this.context2.color}`,padding:5}}>
               Main
               <Content/>
            </div>
        )
    }
}
class Content extends React.Component{
    constructor(props,context){//pros属性对象 context 上下文对象
        super(props,context);
        this.state = {color:context.color};
    }
    contextTypes = {
        color:PropTypes.string,
        changeColor:PropTypes.func
    }
    render(){
        return (
            <div style={{border:`5px solid ${this.state.color}`,padding:5}}>
               Content
            </div>
        )
    }
}
class Page extends React.Component{
    constructor(props){
        super(props);
        this.state = {color:'green'};
    }
    changeColor = (color)=>{
        this.setState({color});
    }
    childContextTypes = {
        color:PropTypes.string,
        changeColor:PropTypes.func
    }
    getChildContext(){
        return {color:this.state.color,changeColor:this.changeColor};
    }
    render(){
        return (
                 <div style={{border:`5px solid ${this.state.color}`,padding:5}}>
                     Page
                    <Main/>
                </div>
        )
    }
}
export default Page;