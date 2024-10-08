const { startOfDay, subMonths, format, parse } = require("date-fns");
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../../../db/models");
const Correlation = db.Correlation;
const StockHistory = db.StockHistory;

// 取得兩支股票的k線圖資料 和相關性
router.get("/candlesticks", async (req, res, next) => {
  try {
    const today = startOfDay(new Date());
    const threeMonthsAgo = subMonths(today, 3);
    const formatDate = (date) => format(date, "yyyy-MM-dd");
    const stock1 = req.query.stock1;
    const stock2 = req.query.stock2;
    const filterStockData = async (symbol) => {
      return await StockHistory.findAll({
        where: {
          symbol: symbol,
          date: {
            [Op.between]: [formatDate(threeMonthsAgo), formatDate(today)],
          },
        },
      });
    };

    const [stock1threeMonths, stock2threeMonths] = await Promise.all([
      filterStockData(stock1),
      filterStockData(stock2),
    ]);

    // 查詢相關性數據
    let correlationData = await Correlation.findOne({
      where: {
        [Op.or]: [
          { stock1: stock1, stock2: stock2 },
          { stock1: stock2, stock2: stock1 },
        ],
      },
    });

    let correlation = correlationData ? correlationData.correlation : null;

    res.json({
      stock1: stock1threeMonths,
      stock2: stock2threeMonths,
      correlation: correlation,
    });
  } catch (error) {
    res.json("error");
  }
});


// 取得correlation資料 
router.get("/correlations/:correlationType", async (req, res) => {
  const correlationType = req.params.correlationType;
  const page = parseInt(req.query.page) || 1;
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  try {
    const { count, rows: correlations } = await Correlation.findAndCountAll({
      where: {
        correlation: correlationType === "positive" ? { [Op.gt]: 0 } : { [Op.lt]: 0 },
      },
      order: [["correlation", correlationType === "positive" ? "DESC" : "ASC"]],
      limit: pageSize,
      offset: offset,
    });
    // const correlations = await Correlation.findAll({
    //   where: {
    //     correlation: sign === "positive" ? { [Op.gt]: 0 } : { [Op.lt]: 0 },
    //   },
    //   order: [["correlation", sign === "positive" ? "DESC" : "ASC"]],
    //   limit: pageSize,
    //   offset: offset,
    // });
    // const count = await Correlation.count({
    //   where: {
    //     correlation: sign === "positive" ? { [Op.gt]: 0 } : { [Op.lt]: 0 },
    //   },
    // });

    if (correlations.length > 0) {
      const totalPages = Math.ceil(count / pageSize);
      res.json({
        correlations: correlations,
        currentPage: page,
        totalPages: totalPages,
        totalItems: count,
      });
    } else {
      res.status(404);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

module.exports = router;
