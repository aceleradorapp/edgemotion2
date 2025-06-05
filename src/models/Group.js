// src/models/Group.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'projects', key: 'id' }
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
  }, {
    tableName: 'groups',
    timestamps: true,
  });

  Group.associate = (models) => {
    Group.belongsTo(models.Project, { foreignKey: 'projectId' });
    Group.hasMany(models.GroupParticipant, { foreignKey: 'groupId' });
  };

  return Group;
};
