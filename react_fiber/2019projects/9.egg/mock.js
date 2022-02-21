let express = require('express');
let Mock = require('mockjs');
let app = express();
app.get('/news',function(req,res){
    let result = Mock.mock({
        "code":0,
        "message":"成功",
        [`data|${req.query.limit}`]:[{
            "id":"@id",
            "title":"@csentence",
            "url":"@url",
            "image":"@image('200x100', '#894FC4', '#FFF', 'png', '!')",
            "createAt":"@datetime"
        }]
    });
    result.data = Array.isArray(result.data)?result.data:[result.data];
    res.json(result);
});
app.get('/cache',function(req,res){
   res.json({title:'服务器返回的新闻标题'+Date.now()});
});
app.listen(3000);