// src/models/GroupParticipant.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const GroupParticipant = sequelize.define('GroupParticipant', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'groups', key: 'id' }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'group_participants',
    timestamps: true,
  });

  GroupParticipant.associate = (models) => {
    GroupParticipant.belongsTo(models.Group, { foreignKey: 'groupId' });
    GroupParticipant.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return GroupParticipant;
};
