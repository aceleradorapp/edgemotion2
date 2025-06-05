// src/models/ToolResult.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const ToolResult = sequelize.define('ToolResult', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true,
    },
    toolInstanceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tool_instances', key: 'id' }
    },
    participantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'project_participants', key: 'id' }
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER, // tempo em segundos
      allowNull: true
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: true // estrutura flexível para diferentes tipos de ferramentas
    }
  }, {
    tableName: 'tool_results',
    timestamps: true,
  });

  ToolResult.associate = (models) => {
    ToolResult.belongsTo(models.ToolInstance, { foreignKey: 'toolInstanceId' });
    ToolResult.belongsTo(models.ProjectParticipant, { foreignKey: 'participantId' });
  };

  return ToolResult;
};
