const Controller = require('egg').Controller;
const {sign} = require('jsonwebtoken');
const BaseController = require('./base');
class UserController extends BaseController {
   constructor(...args){
     super(...args);
     this.entity = 'user';
   }
   async signup(){
     let {app,ctx} = this;
     let body = ctx.request.body;
     let {repassword,address,agreement,prefix,captcha,...user}= body;
     if(user.password !== repassword){
      return this.error('密码和确认密码不一致');
     }
     if(!agreement){
       return this.error('请同意协议后再试');
     }
     if(!captcha || !ctx.session.captcha ||captcha!==ctx.session.captcha){
        return this.error('验证码填写不正确');
     }
     address = address.join('-');
     user.address = address;
     user.phone = prefix+user.phone;
     let result = await app.mysql.insert('user',user);
     if(result.affectedRows>0){
       this.success('注册成功');
     }else{
       this.error('注册失败');
     }
   }
   async signin(){
     let {app,ctx} = this;
     let {username,password,captcha} = ctx.request.body;//{username,password}
     if(!captcha || !ctx.session.captcha ||captcha!==ctx.session.captcha){
        return this.error('验证码填写不正确');
     }
     let result = await app.mysql.get('user',{username,password});
     if(result){
       //因为jwt签名的时候只能传入一个纯对象，而不能是app.mysql对象
       let user = JSON.parse(JSON.stringify(result));
       delete user.password;
       //拿到用户信息之后把用户的权限也返回
       let resources =  await  app.mysql.query(`SELECT resource.* FROM 
role_user INNER JOIN role_resource ON role_user.role_id = role_resource.role_id
INNER JOIN resource ON role_resource.resource_id = resource.id
WHERE role_user.user_id =?`,[user.id]);
       resources = JSON.parse(JSON.stringify(resources));
       let menus=[];
       let map={};
       resources.forEach(resource=>{
         resource.children=[];
         map[resource.id] = resource;
         if(resource.parent_id === 0){
           menus.push(resource);
         }else{
           map[resource.parent_id]&&map[resource.parent_id].children.push(resource);
         }
       });
       user.menus = menus;
       console.log(user);
       let token = sign(user,this.config.JWT_SECRET);
       this.success(token);//{code:0,data:token}
     }else{
        this.error('登录失败');
     }
   }
}

module.exports = UserController;
