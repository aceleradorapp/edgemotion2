// src/models/EmailConfig.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const EmailConfig = sequelize.define('EmailConfig', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true,
    },
    companyGuid: {
      type: DataTypes.UUID,
      allowNull: true // ou false, dependendo da necessidade de multicliente
    },
    host: { type: DataTypes.STRING, allowNull: false },
    port: { type: DataTypes.INTEGER, allowNull: false },
    secure: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, // true para SSL
    authUser: { type: DataTypes.STRING, allowNull: false },
    authPass: { type: DataTypes.STRING, allowNull: false },
    senderName: { type: DataTypes.STRING, allowNull: true }, // Nome que aparece no "De"
    senderEmail: { type: DataTypes.STRING, allowNull: false }, // E-mail que aparece no "De"
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'email_configs',
    timestamps: true
  });

  return EmailConfig;
};
