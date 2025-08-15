// src/models/AiPlugin.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const AiPlugin = sequelize.define('AiPlugin', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        guid: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            allowNull: false,
            unique: true,
        },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        imageUrl: { type: DataTypes.STRING, allowNull: true },
        // A propriedade 'endpointUrl' pode ser o path da rota que executa a funcionalidade
        endpointUrl: { type: DataTypes.STRING, allowNull: false, unique: true },
        // 'enabledGlobally' define se todos os usuários terão acesso
        enabledGlobally: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
        tableName: 'ai_plugins',
        timestamps: true,
    });

    AiPlugin.associate = (models) => {
        AiPlugin.belongsToMany(models.User, {
            through: models.UserPluginAccess,
            foreignKey: 'aiPluginId',
            otherKey: 'userId',
            as: 'users'
        });
    };

    return AiPlugin;
};