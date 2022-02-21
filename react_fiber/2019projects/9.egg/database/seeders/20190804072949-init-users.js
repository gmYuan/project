'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 循环数组 insert into users(name,age,created_at,upated_at) values( 'zhangsan',10,xx,xx)
     return queryInterface.bulkInsert('users', [
        {name: 'zhangsan',age: 10,created_at:new Date(),updated_at:new Date},
        {name: 'lisi',age: 20,created_at:new Date(),updated_at:new Date},
        {name: 'wangwu',age: 30,created_at:new Date(),updated_at:new Date}
       ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
