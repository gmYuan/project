
const {Controller} = require('egg');
class NewsController extends Controller{
    async index(){
        let {ctx} = this;
        //控制器里接收并处理校验参数 
        let limit = ctx.query?ctx.query.limit:5;
        let list = await this.service.news.list(limit);
        await ctx.render('news',{list,title:this.app.cache?this.app.cache.title:'默认新闻列表'});
    }
    async users(){
        const {ctx} = this;
        ctx.body = await ctx.model.User.findAll();
    }
    async greeting(){
        const {ctx} = this;
        console.log('ctx.helper',ctx.helper);
        ctx.body = ctx.__('Email')+ctx.__("Welcome back,%s!","珠峰")+ctx.__("Hello {0},I am {1}",["珠峰","架构"]);
    }
}
module.exports = NewsController;