const {app,mock,assert} = require('egg-mock/bootstrap');
describe('test/extend/response.test.js',async ()=>{
    it('isSuccess',async ()=>{
      let ctx = app.mockContext({
          headers:{
              "user-agent":'Chrome'
          }
      });
      assert(ctx.response.isSuccess);
    });
});