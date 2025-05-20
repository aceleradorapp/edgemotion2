// src/middlewares/authorizeMiddleware.js
function authorize({ allowedUserTypes = [], allowedProfiles = [] }) {
  return (req, res, next) => {
    const { userTypeId, profileId } = req.user;

    const hasPermission =
      (allowedUserTypes.length === 0 || allowedUserTypes.includes(userTypeId)) &&
      (allowedProfiles.length === 0 || allowedProfiles.includes(profileId));

    if (!hasPermission) {
      return res.status(403).json({ error: 'Acesso negado: permissões insuficientes' });
    }

    next();
  };
}

module.exports = authorize;
