const {app,mock,assert} = require('egg-mock/bootstrap');
describe('test/extend/app.test.js',async ()=>{
    it('cache',async ()=>{
       app.cache.set('name','zhufeng');
       assert(app.cache.get('name')==='zhufeng');
    });
});