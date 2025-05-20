// src/models/Profile.js
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
  }, {
    tableName: 'profiles',
    timestamps: false,
  });

  Profile.associate = (models) => {
    Profile.hasMany(models.User, { foreignKey: 'profileId' });
  };

  return Profile;
};
