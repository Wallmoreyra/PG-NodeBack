const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('games', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, { timestamps: true, freezeTableName: true });
};


