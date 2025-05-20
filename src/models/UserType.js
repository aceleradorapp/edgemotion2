// src/models/UserType.js
module.exports = (sequelize, DataTypes) => {
  const UserType = sequelize.define('UserType', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
  }, {
    tableName: 'user_types',
    timestamps: false,
  });

  UserType.associate = (models) => {
    UserType.hasMany(models.User, { foreignKey: 'userTypeId' });
  };

  return UserType;
};
