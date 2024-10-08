'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StockHistory.init({
    symbol: DataTypes.STRING,
    open: DataTypes.DECIMAL,
    high: DataTypes.DECIMAL,
    low: DataTypes.DECIMAL,
    close: DataTypes.DECIMAL,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'StockHistory',
    underscored: true,
    timestamps:false
  });
  return StockHistory;
};