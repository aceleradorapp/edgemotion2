// src/models/UserEvaluationAttempt.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const UserEvaluationAttempt = sequelize.define('UserEvaluationAttempt', {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // <--- ALTERADO PARA TRUE
      references: {
        model: 'users', // Nome da tabela do seu model User
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // <--- Isso agora é compatível com allowNull: true
    },
    evaluationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'evaluations', // Nome da tabela do model Evaluation
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM('started', 'in_progress', 'completed', 'failed', 'passed'),
      allowNull: false,
      defaultValue: 'started',
      comment: 'Status da tentativa: iniciada, em progresso, concluída, falhou, passou',
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalTimeTaken: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Tempo total que o usuário levou para completar a avaliação, em segundos',
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Pontuação final (e.g., percentual de acertos) da tentativa',
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Indica se o usuário foi aprovado nesta tentativa',
    },
    attemptsUsed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Número de tentativas acumuladas para esta avaliação (para o mesmo usuário)',
    },
  }, {
    tableName: 'user_evaluation_attempts',
    timestamps: true,
  });

  UserEvaluationAttempt.associate = (models) => {
    UserEvaluationAttempt.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    UserEvaluationAttempt.belongsTo(models.Evaluation, {
      foreignKey: 'evaluationId',
      as: 'evaluation'
    });
    UserEvaluationAttempt.hasMany(models.UserAnswer, {
      foreignKey: 'userEvaluationAttemptId',
      as: 'userAnswers'
    });
  };

  return UserEvaluationAttempt;
};