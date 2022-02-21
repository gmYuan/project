module.exports = app=>{
    //egg-sequelize插件会把Sequelize添加到app上
    const {INTEGER,STRING,DATE} = app.Sequelize;
    //findAll
    // select id,name,age,created_at,updated_at from  users;
    const User = app.model.define('User',{ 
      id: {type:INTEGER,primaryKey:true,autoIncrement:true},
      name:STRING(30),
      age:INTEGER,
      created_at:DATE,//这条数据的插入时间
      updated_at:DATE//这个数据最后更新时间
    });
    return User;
}