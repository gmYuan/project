//import {createSelector} from 'reselect';
import {Map} from 'immutable';
function createSelector(selector,reduce){
  let lastStateMap={};
  let lastState;//{number:1}
  let lastResult; //5
  return function(state){
     let newState = selector(state);
     if(lastState !== newState){
        console.log('重新计算')
        lastResult = reduce(newState);
        lastState = newState;
     }
     return lastResult;
  }
}
const counterSelector = state=>state.counter1;

let getCounterSelector = createSelector(counterSelector,counter1=>counter1.number*5);

let state = Map({
    counter1:{
        number:1
    },
    counter2:{
        number:2
    }
})
console.log(getCounterSelector(state));//5
//state.counter1.number+=1;
//state.counter1 = {number:state.counter1.number+1}
state = state.setIn(['counter1','number'],2);
console.log(getCounterSelector(state));//5