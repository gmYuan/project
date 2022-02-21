const {app,mock,assert} = require('egg-mock/bootstrap');
describe('test/extend/context.test.js',async ()=>{
    it('language',async ()=>{
      let ctx = app.mockContext({
          headers:{
              "accept-language":'zh-CN'
          }
      });
     /*  ctx.get = function(key){
          return  = ctx.headers[key];
      } */
      assert(ctx.language() === 'zh-CN');
    });
});