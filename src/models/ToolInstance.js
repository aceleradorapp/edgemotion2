// src/models/ToolInstance.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const ToolInstance = sequelize.define('ToolInstance', {
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
    toolType: { type: DataTypes.STRING, allowNull: false }, // Ex: 'quiz-alternativa', 'drag-drop', 'apresentacao'
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    dataUrl: { type: DataTypes.STRING, allowNull: false }, // URL da pasta com os dados
    orderNumber : { type: DataTypes.INTEGER }, // ordem dentro do projeto
    routePage: { type: DataTypes.STRING, allowNull: true },
    codeTool: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: () => uuidv4().replace(/-/g, '').slice(0, 12) // Ex: 12 caracteres únicos
    },
  }, {
    tableName: 'tool_instances',
    timestamps: true,
  });

  ToolInstance.associate = (models) => {
    ToolInstance.belongsTo(models.Project, { foreignKey: 'projectId' });
    ToolInstance.hasMany(models.ToolResult, { foreignKey: 'toolInstanceId' });    
  };

  return ToolInstance;
};
