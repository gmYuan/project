'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let {INTEGER,STRING,DATE} = Sequelize;
    // create table users(id int primary key auto_increment,name varchar(30),age int,created_at datetime,updated_at datetime)
    return queryInterface.createTable('users', { 
      id: {type:INTEGER,primaryKey:true,autoIncrement:true},
      name:STRING(30),
      age:INTEGER,
      created_at:DATE,//这条数据的插入时间
      updated_at:DATE//这个数据最后更新时间
    });
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.dropTable('users');
  }
};
