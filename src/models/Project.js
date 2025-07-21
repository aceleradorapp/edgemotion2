// src/models/Project.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
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
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      defaultValue: '/uploads/project/default.png' // <-- Linha alterada
    },
    isContracted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    codeLink: {
      type: DataTypes.STRING,
      allowNull: true // Pode começar nulo
    },
  }, {
    tableName: 'projects',
    timestamps: true,
  });

  Project.associate = (models) => {
    Project.belongsTo(models.User, { foreignKey: 'userId' });
    Project.hasMany(models.ToolInstance, { foreignKey: 'projectId' });
    Project.hasMany(models.ProjectParticipant, { foreignKey: 'projectId' });
    Project.hasMany(models.SharedLink, { foreignKey: 'projectId' });
    Project.hasMany(models.ToolInstance, { foreignKey: 'projectId' });
  };

  return Project;
};
