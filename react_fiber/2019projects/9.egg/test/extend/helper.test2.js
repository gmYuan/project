const {app,mock,assert} = require('egg-mock/bootstrap');
describe('test/extend/helper.test.js',async ()=>{
    it('fromNow',async ()=>{
      let ctx = app.mockContext({});
      assert(ctx.helper.fromNow(new Date())=='几秒前');
    });
});