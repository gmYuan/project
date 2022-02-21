let Mock = require('mockjs');
let result = Mock.mock({
    "code":0,
    "message":"成功",
    "data|5":[{
        "id":"@id",
        "ip":"@ip",
        "name":"@cname",
        "userId":"@id",
        "stars|2":["※"],
        "avatar":"@image('200x100', '#894FC4', '#FFF', 'png', '!')",
        "createAt":"@datetime"
    }]
});
console.log(result);