// 钩子函数 10次
describe('test/order.test.js',function(){
    //在所有的测试用例 之间执行的函数
    before(()=>console.log('before1'));
    before(()=>console.log('before2'));
    //在每个测试用例之前执行
    beforeEach(()=>console.log('beforeEach'));
    it('order1',()=>console.log('测试用例1'));
    it('order2',()=>console.log('测试用例2'));
    //在每个测试用例之后执行
    afterEach(()=>console.log('afterEach'));
    after(()=>console.log('after1'));
    after(()=>console.log('after2'));
});