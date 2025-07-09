// src/models/Component.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Component = sequelize.define('Component', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true,
    },
    identifier: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false }, // ex: 'Simulação'
    index: { type: DataTypes.INTEGER, allowNull: false },
    route: { type: DataTypes.STRING, allowNull: false },
    userTypeId: { type: DataTypes.STRING, allowNull: false, defaultValue: 'all' },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'component_categories', key: 'id' }
    }
  }, {
    tableName: 'components',
    timestamps: false,
  });

  Component.associate = (models) => {
    Component.belongsTo(models.ComponentCategory, {
      foreignKey: 'categoryId',
      as: 'Category' // 👈 define alias para uso futuro em includes
    });
  };

  return Component;
};
