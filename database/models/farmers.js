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
    f_name: DataTypes.STRING,
    l_name: DataTypes.STRING,
    phone: DataTypes.NUMBER,
    ID: DataTypes.NUMBER,
    email: DataTypes.STRING,
    produce: DataTypes.STRING,
    payment_mode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Farmers',
    underscored: true,
  });
  return Farmers;
};