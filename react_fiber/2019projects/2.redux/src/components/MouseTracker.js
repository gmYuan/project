import React,{Component} from 'react';
class MouseTracker extends React.Component{
    state = {x:0,y:0}
    handleMouseMove = (event)=>{
        this.setState({
            x:event.clientX,
            y:event.clientY
        });
    }
    render(){
        return (
             <div onMouseMove={this.handleMouseMove} >
               {this.props.render(this.state)}
              </div>
        )
    }
}
export default MouseTracker;