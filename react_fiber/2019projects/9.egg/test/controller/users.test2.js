const {app,mock,assert} = require('egg-mock/bootstrap');
//如何在测试用例中拿到ctx对象
describe('test/controller/users.test.js',function(){
   it('doAddUser',async ()=>{
       let user = {username:'zhufeng'};
       app.mockCsrf();
       let result = await app.httpRequest().post('/doAddUser').send(user).expect(200);
       assert(result.body.id === 1);
       let user2 = {username:'zhufeng'};
       let result2 = await app.httpRequest().post('/doAddUser').send(user2).expect(200);
       assert(result2.body.id === 2);
   });
});
