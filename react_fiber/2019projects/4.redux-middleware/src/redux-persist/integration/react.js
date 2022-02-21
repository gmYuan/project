import React from 'react';
class PersistGate extends React.Component{
    componentDidMount(){
        this.props.persistor.initilize();
    }
    componentWillUnmount(){
        console.log('PersistGate componentWillUnmount')
         this.props.persistor.save();
    }
    render(){
        return this.props.children;
    }
}

export {PersistGate}