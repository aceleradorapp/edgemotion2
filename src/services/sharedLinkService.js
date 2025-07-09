// src/services/sharedLinkService.js
const { SharedLink } = require('../models');

async function getKeywordByGuid(guid) {
  const link = await SharedLink.findOne({
    where: {
      guid,
      isActive: true
    }
  });

  if (!link) {
    throw new Error('Link inválido ou inativo.');
  }

  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    await SharedLink.destroy({ where: { id: link.id } });
    throw new Error('Link expirado.');
  }

  return link.keyword;
}

module.exports = {
  getKeywordByGuid,
};
