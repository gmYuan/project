// let app = express();  let app = new Koa();
//express里有静态文件中间件的概念
module.exports = (app)=>{
  //1 从app中结构路由和控制器  new Router();
  // controller={news:new NewsController()}
  const {router,controller} = app;
  //定义一个路由规则 当客户端通过get方式访问/news的时候，会由index函数来返回内容
  router.get('/news',controller.news.index);
  
  router.get('/greeting',controller.news.greeting);
  router.get('/users',controller.users.list);
  //第一个路由返回一个空白表单 第二个路由要实现真正的用户添加
  router.get('/addUser',controller.users.addUser);
  router.post('/doAddUser',controller.users.doAddUser);
}