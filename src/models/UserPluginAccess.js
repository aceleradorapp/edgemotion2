// src/models/UserPluginAccess.js

module.exports = (sequelize, DataTypes) => {
  const UserPluginAccess = sequelize.define('UserPluginAccess', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    aiPluginId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ai_plugins',
        key: 'id'
      },
    }
  }, {
    tableName: 'user_plugin_access',
    timestamps: false, // Esta tabela não precisa de timestamps
  });

  return UserPluginAccess;
};