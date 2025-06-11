const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Destino dinâmico conforme o tipo (ex: user, project)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.params.type || 'users';
    const dir = path.join(__dirname, '../../uploads', folder);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
module.exports = upload;
