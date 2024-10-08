"use strict";
const stockData = require("./stock-data.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const chunkSize = 10000; 
    for (let i = 0; i < stockData.length; i += chunkSize) {
      const chunk = stockData.slice(i, i + chunkSize);
      await queryInterface.bulkInsert("stock_histories", chunk);
      console.log(`存入 ${Math.min(i + chunkSize, stockData.length)} 筆資料`); 
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("stock_histories", null, {});
  },
};
