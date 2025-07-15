// src/models/MenuItem.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('link', 'action'), allowNull: false },
    pathOrAction: { type: DataTypes.STRING, allowNull: true },
    highlight: { type: DataTypes.BOOLEAN, defaultValue: false },
    position: { type: DataTypes.INTEGER, defaultValue: 0 },
    userTypeId: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    profileId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  }, {
    tableName: 'menu_items',
    timestamps: true
  });

  return MenuItem;
};
