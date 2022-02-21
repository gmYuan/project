const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');
class IndexController extends Controller {
  async captcha(){
    let {ctx} = this;
    let captcha =  svgCaptcha.create({});
    //egg.js内置了session插件，可以直接ctx.session
    ctx.session.captcha = captcha.text;
    ctx.set('Content-Type','image/svg+xml');
    ctx.body = captcha.data;
  }
  async checkCaptcha(){
     let {ctx} = this;
     let {captcha} = ctx.request.body;
     if(ctx.session.captcha === captcha){
       ctx.body = {code:0,data:'验证码识别成功'};
     }else{
       ctx.body = {code:1,data:'验证码识别失败'};
     }
  }
}

module.exports = IndexController;
