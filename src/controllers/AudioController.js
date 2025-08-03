// src/controllers/AudioController.js
const fs = require('fs');
const path = require('path');

function getAudioFolderPath(folderName) {
  return path.join(__dirname, '..', '..', 'uploads', 'packages', folderName, 'audioFiles');
}

function getAudiosJsonPath(folderName) {
  return path.join(getAudioFolderPath(folderName), 'audios.json');
}

async function readAudiosJson(folderName) {
  const filePath = getAudiosJsonPath(folderName);
  if (!fs.existsSync(filePath)) return [];
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeAudiosJson(folderName, data) {
  const filePath = getAudiosJsonPath(folderName);
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  // GET audios.json
  async getAudioList(req, res) {
    const { folderName } = req.params;
    try {
      const audioPath = getAudioFolderPath(folderName);
      const filePath = getAudiosJsonPath(folderName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'audios.json não encontrado' });
      }

      const audios = await readAudiosJson(folderName);
      return res.json(audios);
    } catch (err) {
      console.error('Erro ao ler audios.json:', err);
      return res.status(500).json({ message: 'Erro ao ler audios.json' });
    }
  },

  // POST gera áudio (simulado)
  async generateAudio(req, res) {
    const { folderName, sceneNumber, text } = req.body;

    if (!folderName || !sceneNumber || !text) {
      return res.status(400).json({ message: 'folderName, sceneNumber e text são obrigatórios' });
    }

    try {
      const audioPath = getAudioFolderPath(folderName);
      if (!fs.existsSync(audioPath)) {
        await fs.promises.mkdir(audioPath, { recursive: true });
      }

      const audios = await readAudiosJson(folderName);
      const filename = `scene-${sceneNumber}.mp3`;

      // Simulação: adiciona ou substitui
      const index = audios.findIndex(a => a.sceneNumber === sceneNumber);
      if (index !== -1) audios[index] = { sceneNumber, filename };
      else audios.push({ sceneNumber, filename });

      await writeAudiosJson(folderName, audios);

      return res.json({ filename });
    } catch (err) {
      console.error('Erro ao gerar áudio simulado:', err);
      return res.status(500).json({ message: 'Erro ao simular geração de áudio' });
    }
  },

  // DELETE áudio (por sceneNumber ou filename)
  async deleteAudio(req, res) {
    const { folderName, sceneNumber, filename } = req.body;

    if (!folderName || (!sceneNumber && !filename)) {
      return res.status(400).json({ message: 'Informe folderName e sceneNumber ou filename' });
    }

    try {
      const audioPath = getAudioFolderPath(folderName);
      const audios = await readAudiosJson(folderName);

      let target;
      if (sceneNumber) {
        target = audios.find(a => a.sceneNumber === sceneNumber);
      } else {
        target = audios.find(a => a.filename === filename);
      }

      if (!target) {
        return res.status(404).json({ message: 'Áudio não encontrado' });
      }

      const updated = audios.filter(a =>
        (sceneNumber ? a.sceneNumber !== sceneNumber : true) &&
        (filename ? a.filename !== filename : true)
      );

      // Remove do JSON
      await writeAudiosJson(folderName, updated);

      // Remove arquivo físico, se existir
      const filePath = path.join(audioPath, target.filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }

      return res.status(200).json({ message: 'Áudio removido com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar áudio:', err);
      return res.status(500).json({ message: 'Erro ao deletar áudio' });
    }
  }
};
