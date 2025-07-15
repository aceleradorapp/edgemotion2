const jwt = require('jsonwebtoken');
const { User } = require('../models'); // importa o model
const SECRET = process.env.JWT_SECRET || 'segredo-super-seguro';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    req.user = {
      ...decoded,
      displayName: user.displayName,
      photoUrl: user.photoUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    //req.user = user; // usuário completo no request
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = authenticateToken;
