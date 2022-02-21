import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Map,is } from 'immutable';
import _ from 'lodash';
class Counter extends Component {
    state = {counter:Map({number:0})}
    handleClick = () => {
        let amount = this.amount.value ? Number(this.amount.value) : 0;
        //this.state.counter.number = this.state.counter.number + amount;
        //let newCounter = {number:this.state.counter.number+amount};
        let counter = this.state.counter.update('number',x=>x+amount);
        this.setState({counter});
    }
    shouldComponentUpdate(nextProps, nextState) {
       let keys = Object.keys(nextState);
       for(let i=0;i<keys.length;i++){
           let key = keys[i];
           /**if(!_.isEqual(this.state[key] , nextState[key])){
               return true;
           } */
            if(!is(this.state[key],nextState[key])){
               return true;
           }
       }
       return false;
    }
    render() {
        console.log('render');
        return (
            <div>
                <p>{this.state.counter.get('number')}</p>
                <input ref={input => this.amount = input} />
                <button onClick={this.handleClick}>+</button>
            </div>
        )
    }
}

ReactDOM.render(
    <Counter />,
    document.getElementById('root')
)