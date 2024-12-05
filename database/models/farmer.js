'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Farmers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Farmers.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    id: DataTypes.NUMBER,
    produce: DataTypes.STRING,
    email: DataTypes.STRING,
    payment_mode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Farmers',
  });
  return Farmers;
};