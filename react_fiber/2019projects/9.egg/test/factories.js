const {factory} = require('factory-girl');
module.exports = app =>{
    app.factory = factory;//app赋factory属性
    factory.define('user1',app.model.User,{
        name:factory.sequence('User.name1',n=>`name_${n}`),
        age:10
    });
     factory.define('user2',app.model.User,{
        name:factory.sequence('User.name2',n=>`name_${n}`),
        age:10
    });
}