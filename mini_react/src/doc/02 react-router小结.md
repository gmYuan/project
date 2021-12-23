## React-router小结

Q1：如何实现路由变化，页面内容也发生变化

A:
S1 路由分类
  1. hash路由：http: xxx.com/path?query#hash  + window.hashchange回调事件
  2. browser路由：浏览器提供了history对象：history.pushState() / history.replaceState() / history.onpopstate回调属性 (在调用了 histoty.forward/ history.back/ history.go后都会触发执行，因为都改变了 历史堆栈的当前指针)

-----------------------------
Q2  如何实现Router 和 路由切换

A：
S1 react路由使用分层架构，自底向上依次是 `history --> react-router -->  react-router-dom` 结构

S2 react-router-dom ==> BrowserRouter/HashRouter 步骤
  1.  this.history = history.createHashHistory(props)
  2. 返回一个增强组件 `<Router history={this.history}></Router>`

S3 react-router ==> Router步骤
  1. 返回一个 `<RouterContext.Provider value={value}>`的 context组件
  2. value包含  { location，history } 等 子路由都需要知道的信息
  3. Router会 监听路径变化，当路径发生变化 后执行回调：props.history.listen(cb)
  4. cb 会更新state.location为 最新的location路径值，从而引起组件刷新

S4  react-router ==> Route步骤
  1. 接收全局的 { location，history }信息，以及通过props传递过来的 com/path等
  2. 根据 location.pathname 和  path值做路由比对，返回对应的 com作为结果渲染


S5.1  history ==> createBrowserHistory步骤
  1. 返回一个对象：histoty = { location:{ pathname,state} }, push, listen, ....}
  2. push方法 ==> 获取最新的 path和state +  globalHistory.pushState(state, null, pathname) +   notify( {action,location} )
  3. popstate回调监听 ==>  notify( { action:"POP", location} )

S5.2 history ==> createHashHistory步骤
  1. 返回一个对象：histoty = { location:{ pathname,state} }, push, listen, ....}
  2. push方法 ==> 获取最新的 path和state + window.location.hash = pathname
  3. hashchange回调监听 ==>  类似于notify()
     
       