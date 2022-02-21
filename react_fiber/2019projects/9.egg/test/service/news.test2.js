const {app,mock,assert} = require('egg-mock/bootstrap');
describe('test/service/news.js',async ()=>{
    it('测试list方法',async ()=>{
        let ctx = app.mockContext();
        const LENGTH = 3;
        let result = await ctx.service.news.list(LENGTH);
        assert(result.length == LENGTH);
    });
});