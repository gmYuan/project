/**
 * hash不能使用 浏览器的history对象了
 * @returns 
 */
function createHashHistory(){
    let stack = [];//类似于历史栈 里面存放都是路径
    let index = -1;//栈的指针，默认是-1
    let action = 'POP';//动作
    let state ;//最新的状态 
    let listeners = [];//监听函数的数组
    function listen(listener){
        listeners.push(listener);
        return ()=>{
            listeners = listeners.filter(item=>item!==listener);
        }
    }

    function push(path,nextState){
        action = 'PUSH';
        let pathname
        if(typeof pathname ==='object'){
            state = path.state;
            pathname = path.pathname
        }else{
            state = nextState;
            pathname = path
        }
        window.location.hash = pathname
    }

    function go(n){
        action = 'POP';
        index+=n;//更改栈顶的指针
        let nextLocation = stack[index];//取出指定索引对应的路径对象
        state= nextLocation.state;//取出此location对应的状态 
        window.location.hash = nextLocation.pathname;//修改hash值 ，从而修改当前的路径
    }

    function goBack(){
        go(-1);
    }
    function goForward(){
        go(1);
    }

    //当hash发生变化的话，会执行回调
    window.addEventListener('hashchange',hashChangeHandler);
    function hashChangeHandler() {
        let pathname = window.location.hash.slice(1);//取出最新的hash值对应的路径  #/user
        Object.assign( history, { action, location: {pathname,state} })
        if(action === 'PUSH'){   //说明是调用push方法，需要往历史栈中添加新的条目 
            stack[++index]=history.location
        }
        listeners.forEach(listener=>listener(history.location));
    }
 
    const history = {
        action:'POP',
        go,
        goBack,
        goForward,
        push,
        listen,
        location:{pathname:'/',state:undefined}
    }
    if(window.location.hash){//如果初始的情况下，如果hash是有值的
        action = 'PUSH';
        hashChangeHandler();
    }else{
        window.location.hash = '/';
    }
    return history;
}
export default createHashHistory;