// src/models/UserAnswer.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const UserAnswer = sequelize.define('UserAnswer', {
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
    userEvaluationAttemptId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_evaluation_attempts', // Nome da tabela do model UserEvaluationAttempt
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'questions', // Nome da tabela do model Question
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    // CORREÇÃO: Alterado de DataTypes.JSONB para DataTypes.TEXT
    selectedOptions: {
      type: DataTypes.TEXT, // Armazenará o JSON como string
      allowNull: false,
      comment: 'Array de IDs ou textos das opções selecionadas pelo usuário para esta questão em formato JSON string',
      get() {
        const rawValue = this.getDataValue('selectedOptions');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('selectedOptions', JSON.stringify(value));
      }
    },
    timeTaken: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Tempo em segundos que o usuário levou para responder esta questão específica',
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Indica se a resposta do usuário para esta questão estava correta',
    },
  }, {
    tableName: 'user_answers',
    timestamps: true,
  });

  UserAnswer.associate = (models) => {
    UserAnswer.belongsTo(models.UserEvaluationAttempt, {
      foreignKey: 'userEvaluationAttemptId',
      as: 'attempt'
    });
    UserAnswer.belongsTo(models.Question, {
      foreignKey: 'questionId',
      as: 'question'
    });
  };

  return UserAnswer;
};