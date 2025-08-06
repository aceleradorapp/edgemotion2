// src/models/Question.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
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
    type: {
      type: DataTypes.ENUM('multiple_choice_single', 'multiple_choice_multiple', 'true_false'),
      allowNull: false,
      comment: 'Tipo da questão: única escolha, múltiplas escolhas ou verdadeiro/falso',
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // CORREÇÃO: Alterado de DataTypes.JSONB para DataTypes.TEXT
    options: {
      type: DataTypes.TEXT, // Armazenará o JSON como string
      allowNull: false,
      comment: 'Array de objetos { text: "Opção", isCorrect: true/false } em formato JSON string',
      // Você pode adicionar um getter/setter para garantir que sempre seja tratado como JSON
      get() {
        const rawValue = this.getDataValue('options');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('options', JSON.stringify(value));
      }
    },
  }, {
    tableName: 'questions',
    timestamps: true,
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Evaluation, {
      foreignKey: 'evaluationId',
      as: 'evaluation'
    });
    Question.hasMany(models.UserAnswer, {
      foreignKey: 'questionId',
      as: 'userAnswers'
    });
  };

  return Question;
};