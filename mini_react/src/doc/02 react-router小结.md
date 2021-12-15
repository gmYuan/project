## React-router小结

Q1：如何实现路由变化，页面内容也发生变化

A:
S1 路由分类
  1. hash路由：http: xxx.com/path?query#hash  + window.hashchange回调事件
  2. browser路由：浏览器提供了history对象：history.pushState() / history.replaceState() / history.onpopstate回调属性 (在调用了 histoty.forward/ history.back/ history.go后都会触发执行，因为都改变了 历史堆栈的当前指针)




-----------------------------
Q2 

A：
S
