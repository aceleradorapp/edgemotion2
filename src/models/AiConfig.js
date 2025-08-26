// src/models/AiConfig.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const AiConfig = sequelize.define('AiConfig', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    provider: { type: DataTypes.STRING, allowNull: false },
    apiKey: { type: DataTypes.STRING, allowNull: false },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    tableName: 'ai_configs',
    timestamps: true,
  });

  AiConfig.associate = (models) => {
    AiConfig.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return AiConfig;
};