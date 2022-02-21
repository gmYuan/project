let {verify} = require('jsonwebtoken');
function verifyToken(token,secret){
    return new Promise(function(resolve,reject){
        verify(token,secret,(err,user)=>{
                    if(err){
                       reject(err);
                    }else{
                       resolve(user);
                    }
        });
    });
}
//options代表此中间件的配置对象 app 代表应用对象
module.exports = function(options,app){
    return async (ctx,next)=>{
        let token = ctx.get('authorization');
        if(token){
            try{
               let user = await verifyToken(token,this.config.JWT_SECRET);
               ctx.session.user = user;//在控制器里可以使用此对象
               await next();
            }catch(error){
               ctx.status = 403;
               ctx.body = {code:1,error:'token不合法'};
            }
        }else{
            ctx.status = 403;
            ctx.body = {code:1,error:'token不存在'};
        }
    }
}