import React from 'react';
let ThemeContext = createContext();
function createContext(){
    class Provider extends React.Component{
        static value;
        constructor(props){
            super(props);//{value:xx}
            Provider.value = props.value;
            this.state = {number:0};
        }
        /*         componentWillReceiveProps(nextProps){
          Provider.value = nextProps.value;
        } */
        //每当此组件接收到新的属性的时候，都会执行这个方法，这个方法会返回新的状态对象
        static getDerivedStateFromProps(nextProps,prevState){
            Provider.value = nextProps.value;
            return prevState;
        }
        render(){
            return this.props.children;
        }
    }
    class Consumer extends React.Component{
        render(){
            return this.props.children(Provider.value);
        }
    }
    return {Provider,Consumer}
}
//ThemeContext {Provider,Consumer}
class Header extends React.Component{
     static contextType = ThemeContext;
     constructor(props){//pros属性对象 context 上下文对象
        super(props);
    }
    render(){
        this.context2 = Content.contextType.Provider.value;
        return (
            <div style={{border:`5px solid ${this.context2.color}`,padding:5}}>
               Header
               <Title/>
            </div>
        )
    }
}
/* class Title extends React.Component{
     static contextType = ThemeContext;
    render(){
        return (
            <div style={{border:`5px solid ${this.context.color}`,padding:5}}>
               Title
            </div>
        )
    }
} */
function Title(){
   return (
       <ThemeContext.Consumer>
          {
              value=>(
                   <div style={{border:`5px solid ${value.color}`,padding:5}}>
                      Title
                   </div>
              )
          }
       </ThemeContext.Consumer>
   )
}
class Main extends React.Component{
     static contextType = ThemeContext;
     constructor(props){//pros属性对象 context 上下文对象
        super(props);
    }
    render(){
        this.context2 = Content.contextType.Provider.value;
        return (
            <div style={{border:`5px solid ${this.context2.color}`,padding:5}}>
               Main
               <Content/>
            </div>
        )
    }
}
class Content extends React.Component{
    static contextType = ThemeContext;
    constructor(props){//pros属性对象 context 上下文对象
        super(props);
    }
    render(){
        this.xxx = Content.contextType.Provider.value;
        return (
            <div style={{border:`5px solid ${this.context2.color}`,padding:5}}>
               Content
               <button onClick={()=>this.context2.changeColor('red')}>变红</button>
               <button onClick={()=>this.context2.changeColor('green')}>变绿</button>
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
    render(){
        let value = {color:this.state.color,changeColor:this.changeColor};
        console.log('Page.render',value)
        return (
            <ThemeContext.Provider value={value}>
                 <div style={{border:`5px solid ${this.state.color}`,padding:5}}>
                     Page
                    <Header/>
                    <Main/>
                </div>
            </ThemeContext.Provider>
        )
    }
}
export default Page;