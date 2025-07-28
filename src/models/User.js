// src/models/User.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true,
    },
    companyGuid: {
      type: DataTypes.UUID,
      allowNull: true // ou false, depende da regra
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    displayName: { type: DataTypes.STRING },
    photoUrl: { type: DataTypes.STRING },
    userTypeId: {
      type: DataTypes.INTEGER,
      references: { model: 'user_types', key: 'id' }
    },
    profileId: {
      type: DataTypes.INTEGER,
      references: { model: 'profiles', key: 'id' }
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'users',
    timestamps: true,
  });

  User.associate = (models) => {
    User.belongsTo(models.UserType, { foreignKey: 'userTypeId' });
    User.belongsTo(models.Profile, { foreignKey: 'profileId' });
  };

  return User;
};
