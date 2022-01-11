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
     
-------
Q3: location.pathname 和 path值做路由比对，具体是如何进行比对的
A:
S1 方法1: 严格相等匹配 location.pathname===props.path
  - 缺点是 无法支持 非精准匹配功能

S2 方法2：正则匹配
  - path-to-regexp库 + 捕获分组生成路由params
  - 实现路由匹配 工具函数：matchPath(pathname,options)

S2.2 matchPath(pathname,options)实现流程
  - 通过 const regexp = pathToRegexp(path, keys, options) 生成路径对应的正则
  -  const match = regexp.exec(pathname)判断 是否匹配路由
  -  返回 { path, url, isExact, params }对象，作为 routeProps.match值

-----------------------------
Q4: 如何实现switch
A：
S1 遍历React.chilren，通过matchPath 查找匹配的route
  - React.Children.forEach

S2 返回匹配的 route/null
  - React.cloneElement( element,{computedMatch:match} ) / null


-----------------------------
Q5: 如何实现 <Link>内置组件
A：
S1 <a>组件 +  history.push(props.to)
  - 不直接使用a组件，是因为<a>组件只支持字符串，而<Link>的to属性 可以支持传递对象

S2 history兼容 path传入的是 对象
  - createHashHistory/createBrowserHistory.push(path, nextState)

S3 实现嵌套路由
  1.  使用 <route>定义 路径和组件的对应关系
  2. 父子组件之间，任意嵌套使用 <Link>来 进行路径的跳转
  3. 利用 <Switch> 和 <Router> 传递的公有信息，来获取路径的变量值


-----------------------------
Q6: 如何实现 受保护的路由
A：
S1  利用高阶函数组件，接收 {path,  componentRoute} 的 props
S2 使用 route的 render属性，来实现路由的 逻辑分发
S3 关于重定向的逻辑，被跳过了，需要待补充


-----------------------------
Q7: 如何实现导航链接
A：
S1 props属性 支持更多个配置项的 升级版Link组件


-----------------------------
Q8: 如何实现withRouter
A：
S1 功能：通过HOC，让任意组件，都能获取到{ history, location, match}信息

S2 实现流程：
   - withRouter 属性代理实现


-----------------------------
Q9: 如何实现prompt
A：
S1 使用方法：`<Prompt when={xxx} message={yyy} />`

S2 实现流程
  1. 获取 React.useContext(RouterContext)
  2. 调用 history.block(message)以显示 确认弹窗
     - block方法：赋值/清空 message值
     - push方法里存在 message时，就 显示弹窗 + 根据结果 阻止跳转 
  3. 卸载组件时，去除message信息

