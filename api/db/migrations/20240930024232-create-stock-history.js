"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "stock_histories",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        symbol: {
          type: Sequelize.STRING,
        },
        open: {
          type: Sequelize.DECIMAL(10, 2),
        },
        high: {
          type: Sequelize.DECIMAL(10, 2),
        },
        low: {
          type: Sequelize.DECIMAL(10, 2),
        },
        close: {
          type: Sequelize.DECIMAL(10, 2),
        },
        date: {
          type: Sequelize.DATEONLY,
        },
      },
      {
        timestamps: false, 
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("stock_histories");
  },
};
