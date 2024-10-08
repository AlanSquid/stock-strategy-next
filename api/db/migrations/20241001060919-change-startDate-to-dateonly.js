'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('correlations', 'start_date', {
      type: Sequelize.DATEONLY,
      allowNull: true, 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('correlations', 'start_date', {
      type: Sequelize.DATE, // 恢復原來的資料型態
      allowNull: true, // 根據需要設置
    });
  }
};
