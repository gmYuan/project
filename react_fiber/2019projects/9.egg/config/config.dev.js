//cookie session 加密cookie 服务器把cookie发送给客户端之后，为了防止客户端篡改数据，就需要设置一个密码
//exports.keys = 'zhufeng';
//中间件和插件的区是什么？
//中间件是什么时候用的？是在请求到来的时候，在真正的处理之前执行一段逻辑
//插件 是扩展了egg.js的一些功能,比如能让egg.js渲染nunjucks模板
module.exports = app =>{
    let config = {};
    
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
    return config;
}