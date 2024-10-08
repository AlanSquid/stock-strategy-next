"use strict";
const stockData = require("./stock-data.json");
const { parse } = require("date-fns");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("資料量:", stockData.length);

    // 按股票代號分組
    const stockMap = new Map();
    stockData.forEach((record) => {
      if (!stockMap.has(record.symbol)) {
        stockMap.set(record.symbol, []);
      }
      stockMap.get(record.symbol).push({
        date: parse(record.date, "yyyy-MM-dd", new Date()),
        close: parseFloat(record.close),
      });
    });

    // 為每個股票計算日漲跌
    const stockChangesMap = new Map();
    for (let [symbol, data] of stockMap) {
      data.sort((a, b) => a.date - b.date);
      const changesMap = new Map();

      for (let i = 1; i < data.length; i++) {
        const currentDate = data[i].date;
        const previousDate = data[i - 1].date;

        const change = data[i].close - data[i - 1].close;
        changesMap.set(currentDate.getTime(), {
          change,
          previousDate: previousDate,
        });
      }
      stockChangesMap.set(symbol, changesMap);
    }

    // 計算相關性
    const symbols = Array.from(stockMap.keys());
    const results = [];
    let batchCounter = 0;
    console.log("開始計算相關性...");
    let totalSaved = 0;
    const totalPairs = (symbols.length * (symbols.length - 1)) / 2; // 總對數
    let processedPairs = 0; // 已處理的對數

    const correlationPromises = symbols.flatMap((stock1, i) =>
      symbols.slice(i + 1).map(async (stock2) => {
        const changes1 = stockChangesMap.get(stock1);
        const changes2 = stockChangesMap.get(stock2);
        const commonDates = new Set(
          [...changes1.keys()].filter((date) => changes2.has(date))
        );

        if (commonDates.size === 0) return; // 如果没有共同日期跳過

        const startDate = new Date(Math.min(...commonDates));
        let correlation = 0;
        let daysCount = 0;

        for (const dateTime of commonDates) {
          const change1 = changes1.get(dateTime).change;
          const change2 = changes2.get(dateTime).change;

          daysCount++;

          // 計算相關性
          if (change1 === 0 && change2 === 0) {
            correlation++; // 同時不變
          } else if (change1 > 0 && change2 > 0) {
            correlation++; // 同時上漲
          } else if (change1 < 0 && change2 < 0) {
            correlation++; // 同時下跌
          } else if (
            (change1 > 0 && change2 < 0) ||
            (change1 < 0 && change2 > 0)
          ) {
            correlation--; // 相反變化
          }
        }
     
        if (daysCount > 0) {
          results.push({
            stock1,
            stock2,
            start_date: startDate,
            quantity: daysCount,
            correlation,
            created_at: new Date(), // 提供 created_at 值
            updated_at: new Date(), // 提供 updated_at 值
          });
        }
        processedPairs++;
        if (processedPairs % 10000 === 0 || processedPairs === totalPairs) {
          console.log(`已處理 ${processedPairs} / ${totalPairs} 對`);
        }
      })
    );

    // 等待所有計算完成
    await Promise.all(correlationPromises);

    // 批量插入資料
    const batchSize = 10000;

    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      await queryInterface.bulkInsert("correlations", batch, {
        logging: false,
      });
      totalSaved += batch.length;
      console.log("已存入", totalSaved);
    }
    console.log("所有相關性計算完成，總數:", totalSaved);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("correlations", null, {});
  },
};
