const {app,mock,assert} = require('egg-mock/bootstrap');
//如何在测试用例中拿到ctx对象
describe('test/controller/news.test.js',function(){
   /*  it('get a ctx',()=>{
        let ctx = app.mockContext({
            session:{name:'zhufeng'}
        });//ctx.session.name = 'zhufeng'
        //断言，里面放一个布尔表达式，如果它为true的话，则什么都不错，如果为false抛异常让测试用例失败
        assert(ctx.method == 'GET');
        assert(ctx.url == '/');
        assert(ctx.session.name === 'zhufeng');
    }); */
    //我们看一下如何在测试用途中实现异步测试
    //异步测试分为三种 promise callback async/await 
    it('promise',()=>{
        //此代码相当于用客户端向服务器发送了一个get方法的/news请求，期待返回的状态码为200
        return app.httpRequest().get('/news').expect(200);
    });
     it('callback',(done)=>{
        //此代码相当于用客户端向服务器发送了一个get方法的/news请求，期待返回的状态码为200
        //接收一个done参数.然后测试用例执行到此的时候会等待内部代码done方法
        app.httpRequest().get('/news').expect(200,done);
    });
    it('async+await',async ()=>{
        //此代码相当于用客户端向服务器发送了一个get方法的/news请求，期待返回的状态码为200
        //接收一个done参数.然后测试用例执行到此的时候会等待内部代码done方法
        let result =  await app.httpRequest().get('/news');
        //console.log(result);
    });
});
/**
从外往内测试
1. 控制器 2. service 3 model extend 中间件
 */