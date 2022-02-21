
function renderApp(appState){
   renderTitle(appState.title);
   renderContent(appState.content);
}
function renderTitle(title){
  let titleEle = document.getElementById('title');
  titleEle.innerHTML = title.text;
  titleEle.style.color = title.color;
}
function renderContent(content){
  let contentEle = document.getElementById('content');
  contentEle.innerHTML = content.text;
  contentEle.style.color = content.color;
}
const UPDATE_TITLE_COLOR = 'UPDATE_TITLE_COLOR';
const UPDATE_TITLE_TEXT = 'UPDATE_TITLE_TEXT';
const UPDATE_CONTENT_COLOR = 'UPDATE_CONTENT_COLOR';
const UPDATE_CONTENT_TEXT = 'UPDATE_CONTENT_TEXT';
let initState ={
        title:{
            color:'red',
            text:'标题'
        },
        content:{
            color:'green',
            text:'内容'
        }
}
function reducer(state=initState,action){
 //action就是一个普通对象，至少有一个属性type 表示动作类型，表示你想对仓库里的状态干什么，另外其它的属性任意给，没有限制
        switch(action.type){
            case  UPDATE_TITLE_COLOR:
             return {...state,title:{...state.title,color:action.color}};
            break;
            case  UPDATE_TITLE_TEXT:
             return {...state,title:{...state.title,title:action.text}};
            break;
            case  UPDATE_CONTENT_COLOR:
             return {...state,content:{...state.content,color:action.color}};
            break;
            case  UPDATE_CONTENT_TEXT:
             return {...state,content:{...state.content,text:action.text}};
            break;
            default:
             return state; 
        }
}
function createStore(reducer){
    let state;
    let listeners = [];
    //负责返回当前的状态
    function getState(){
        return state;
    }
    //我们可以派发一个动作，现在规定要想修改状态，只能通过派发动作的方式来修改
    function dispatch(action){
       state = reducer(state,action);
       listeners.forEach(l=>l());
    }
    //subscribe方法每次调用都会返回一个取消订阅的方法
    function subscribe(listener){ 
       listeners.push(listener);
       return function(){
           listeners = listeners.filter(item=>item!==listener);
       }
    }
    dispatch({type:"@@TYEP/REDUX_INIT"});
    return {dispatch,getState,subscribe};
}

let store = createStore(reducer);

function render(){
  renderApp(store.getState());
}
render();
let unsubscribe = store.subscribe(render);
setTimeout(() => {
  store.dispatch({type:UPDATE_TITLE_COLOR,color:'purple'});
  unsubscribe();
  store.dispatch({type:UPDATE_CONTENT_TEXT,text:'新内容'});
}, 1000);

