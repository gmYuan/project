
const {Controller} = require('egg');
let users = [];
class UsersController extends Controller{
   async list(){
       let result = await this.app.model.User.findAll();
       this.ctx.body = result;
   }
   async addUser(){
       await this.ctx.render('user/add');
   }
   async doAddUser(){
       let {ctx} = this;
       let user = ctx.request.body;
       user.id = users.length>0?users[users.length-1].id+1:1;
       users.push(user);
       ctx.body = user; 
   }
}
module.exports = UsersController;