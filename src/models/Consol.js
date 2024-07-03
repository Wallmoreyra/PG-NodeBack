const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('consol', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  }, { timestamps: false, freezeTableName: true });
};