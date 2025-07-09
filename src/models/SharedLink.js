// src/models/SharedLink.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const SharedLink = sequelize.define('SharedLink', {
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
      allowNull: true, // Pode ser nulo se for anônimo
      references: { model: 'users', key: 'id' }
    },
    linkCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Código do link gerado (ex: UUID ou hash)
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true // Link pode ter validade
    },
    keyword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'shared_links',
    timestamps: true,
  });

  SharedLink.associate = (models) => {
    SharedLink.belongsTo(models.Project, { foreignKey: 'projectId' });
    SharedLink.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return SharedLink;
};
