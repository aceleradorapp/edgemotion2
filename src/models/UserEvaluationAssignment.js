const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const UserEvaluationAssignment = sequelize.define('UserEvaluationAssignment', {
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
            allowNull: false,
            references: {
                model: 'users', // Nome da tabela do seu model User
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE', // Se o usuário for deletado, a atribuição também
        },
        evaluationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'evaluations', // Nome da tabela do model Evaluation
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE', // Se a avaliação for deletada, a atribuição também
        },
        //Você pode adicionar campos adicionais aqui, se necessário:
        assignedDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        dueDate: { // Data limite para o usuário completar a avaliação
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: { // 'assigned', 'in_progress', 'completed', 'expired'
            type: DataTypes.ENUM('assigned', 'in_progress', 'completed', 'expired'),
            defaultValue: 'assigned',
        },
        overrideMaxAttempts: { // Se quiser que esta atribuição tenha um número diferente de tentativas
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'user_evaluation_assignments',
        timestamps: true, // Para createdAt e updatedAt
        indexes: [
            { // Garante que um usuário só possa ter uma atribuição por avaliação
                unique: true,
                fields: ['userId', 'evaluationId']
            }
        ]
    });

    UserEvaluationAssignment.associate = (models) => {
        UserEvaluationAssignment.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        UserEvaluationAssignment.belongsTo(models.Evaluation, {
            foreignKey: 'evaluationId',
            as: 'evaluation'
        });
    };

    return UserEvaluationAssignment;
};