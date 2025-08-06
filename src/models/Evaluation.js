// src/models/Evaluation.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define('Evaluation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    guid: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    passingPercentage: {
      type: DataTypes.FLOAT, // Usar FLOAT para percentual (e.g., 0.75 para 75%)
      allowNull: false,
      defaultValue: 0.70, // Um valor padrão, pode ser ajustado
    },
    maxAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Um valor padrão, pode ser ajustado
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    companyGuid: { // Se a avaliação puder ser vinculada a uma empresa específica
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    tableName: 'evaluations',
    timestamps: true,
  });

  Evaluation.associate = (models) => {
    // Uma avaliação pode ter muitas questões
    Evaluation.hasMany(models.Question, {
      foreignKey: 'evaluationId',
      as: 'questions'
    });
    // Uma avaliação pode ter muitas tentativas de usuários
    Evaluation.hasMany(models.UserEvaluationAttempt, {
      foreignKey: 'evaluationId',
      as: 'userAttempts'
    });
  };

  return Evaluation;
};