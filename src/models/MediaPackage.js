//src/models/MediaPackage.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const MediaPackage = sequelize.define('MediaPackage', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        guid: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            allowNull: false,
            unique: true,
        },
        name: { // Nome da pasta
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: { model: 'users', key: 'id' },
            allowNull: false,
        },
    }, {
        tableName: 'media_packages',
        timestamps: true,
        paranoid: true, // soft delete
    });

    MediaPackage.associate = (models) => {
        MediaPackage.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return MediaPackage;
};
