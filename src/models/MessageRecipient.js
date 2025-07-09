module.exports = (sequelize, DataTypes) => {
  const MessageRecipient = sequelize.define('MessageRecipient', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    messageId: { type: DataTypes.INTEGER, allowNull: false },
    recipientId: { type: DataTypes.INTEGER, allowNull: false },
    readAt: { type: DataTypes.DATE, allowNull: true },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'message_recipients',
    timestamps: true
  });

  MessageRecipient.associate = (models) => {
    MessageRecipient.belongsTo(models.User, { foreignKey: 'recipientId', as: 'recipient' });
    MessageRecipient.belongsTo(models.Message, { foreignKey: 'messageId', as: 'message' });
  };

  return MessageRecipient;
};
