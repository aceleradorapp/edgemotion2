// src/models/ProjectParticipant.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const ProjectParticipant = sequelize.define('ProjectParticipant', {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    },
    guestEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tokenAccess: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'em_progresso', 'finalizado'),
      defaultValue: 'pendente'
    }
  }, {
    tableName: 'project_participants',
    timestamps: true,
  });

  ProjectParticipant.associate = (models) => {
    ProjectParticipant.belongsTo(models.Project, { foreignKey: 'projectId' });
    ProjectParticipant.belongsTo(models.User, { foreignKey: 'userId' });
    ProjectParticipant.hasMany(models.ToolResult, { foreignKey: 'participantId' });
  };

  return ProjectParticipant;
};
