'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Correlation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Correlation.init({
    stock1: DataTypes.STRING,
    stock2: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    quantity: DataTypes.INTEGER,
    correlation: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Correlation',
    underscored: true,
  });
  return Correlation;
};