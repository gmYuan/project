
import {createStore} from './redux';
let counterValEle = document.getElementById('counterVal');
let addBtn = document.getElementById('addBtn');
let minusBtn = document.getElementById('minusBtn');
function reducer(state={number:0},action){
  switch(action.type){
    case 'ADD':
      return {number:state.number+1};
    case 'MINUS':
      return {number:state.number-1};  
    default:
      return state;  
  }
}
let store = createStore(reducer);
function render(){
  counterValEle.innerHTML = store.getState().number;
}
render();
store.subscribe(render);
addBtn.addEventListener('click',()=>store.dispatch({type:'ADD'}));
minusBtn.addEventListener('click',()=>store.dispatch({type:'MINUS'}));
