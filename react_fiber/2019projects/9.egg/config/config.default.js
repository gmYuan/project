//cookie session 加密cookie 服务器把cookie发送给客户端之后，为了防止客户端篡改数据，就需要设置一个密码
//exports.keys = 'zhufeng';
//中间件和插件的区是什么？
//中间件是什么时候用的？是在请求到来的时候，在真正的处理之前执行一段逻辑
//插件 是扩展了egg.js的一些功能,比如能让egg.js渲染nunjucks模板
module.exports = app =>{
    let config = {};
    config.i18n = {
        defaultLocale:'en-US'
    }
    //配置加密的key用来加密cookie
    config.keys = app.name+'201984112045';
    //配置视图的 view
    config.view = {
        //默认的扩展名 当你渲染一个文件，但是没有指定扩展名，而且又找不到这个文件，就会尝试添加这个扩展名去再查找一次
        defaultExtension:'.html',
        //如果某个扩展名的模板文件没有在mapping里配置，那么就会用这个默认的模板引擎来进行渲染
        defaultViewEngine:'nunjucks',
        //如果要渲染的模板是以.html结尾的话，就会用nunjucks模板引擎来进行渲染
        mapping:{
            '.html':'nunjucks',
            '.ejs':'ejs'
        }
    }
    config.news = {
        url:'http://localhost:3000/news'
    }
    config.cache = {
        url:'http://localhost:3000/cache'
    }
    config.mysql = {
        client:{
            host:'localhost',
            user:'root',
            password:'root',
            port:3306,
            database:'cms-development'
        },
        app:true//要把mysql模块挂载到app对象app.mysql
    }
    config.sequelize={
        //java hibernate 方言 关系型数据库mysql mariadb mssqlserver oralce 
        dialect:'mysql',
        host:'localhost',
        user:'root',
        password:'root',
        port:3306,
        database:'cms-development'
    }
    //middleware属性是定死的，表示我要启用的中间件
    //config.middleware = ["robot"];
    config.robot={
        ua:[]
    }
    return config;
}