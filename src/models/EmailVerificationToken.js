// src/models/EmailVerificationToken.js
module.exports = (sequelize, DataTypes) => {
  const EmailVerificationToken = sequelize.define('EmailVerificationToken', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    tokenHash: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    usedAt: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'email_verification_tokens',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['tokenHash'], unique: true },
      { fields: ['expiresAt'] }
    ]
  });

  EmailVerificationToken.associate = (models) => {
    EmailVerificationToken.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return EmailVerificationToken;
};
