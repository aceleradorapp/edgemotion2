// src/models/ComponentCategory.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const ComponentCategory = sequelize.define('ComponentCategory', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    index: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  }, {
    tableName: 'component_categories',
    timestamps: false,
  });

  ComponentCategory.associate = (models) => {
    ComponentCategory.hasMany(models.Component, {
      foreignKey: 'categoryId',
      as: 'Components' // 👈 necessário para funcionar o include e map()
    });
  };

  return ComponentCategory;
};
