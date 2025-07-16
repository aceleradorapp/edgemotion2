function authorizeOwner(req, res, next) {
  const user = req.user;

  if (!user || user.role !== 'owner') {
    return res.status(403).json({ error: 'Acesso negado: apenas usuários do tipo owner podem acessar esta rota.' });
  }

  next();
}

module.exports = authorizeOwner;
