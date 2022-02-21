const {app,assert} = require('egg-mock/bootstrap');
const factories = require('./factories');
//在所有的测试用例执行之前执行一次函数
before(()=>factories(app));
afterEach(async ()=>{
    //保证在每一次测试用例执行完成后把表进行清空操作
    await app.model.User.destroy({truncate:true,force:true})
});
describe('app/controller/users.js',()=>{
    it('list',async ()=>{
        console.log('list')
        await app.factory.createMany('user1',5);
        const result = await app.httpRequest().get('/users').expect(200);
        assert(result.status == 200);
        assert(result.body.length == 5);
        //assert(result.body[0].name == 'name_1');
        //assert(result.body[4].name == 'name_5');
        //assert(result.body[0].age == 10);
    });
      it('list2',async ()=>{
        console.log('list2')
        await app.factory.createMany('user2',5);
        const result = await app.httpRequest().get('/users').expect(200);
        assert(result.status == 200);
        assert(result.body.length == 5);
        console.log(result.body)
        assert(result.body[0].id == 1);
        assert(result.body[0].age == 10);
    });
});