require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { getKeywordByGuid } = require('../services/sharedLinkService');
const URLAPI = process.env.URLAPI;

class PlayerController {

    getPlayer = async (req, res) => {
        const { guid } = req.body;
        const keyword = await getKeywordByGuid(guid);   // endpoint do service e da controller     
        const urlApiMaster = URLAPI+'/uploads/packages/';
        const htmlPath = path.join(__dirname, '../../public/player1/index.html');

        fs.readFile(htmlPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo HTML:', err);
                return res.status(500).send('Erro ao carregar o player.');
            }

            const modifiedHtml = data.replace(
                '<!--KEY_PLACEHOLDER-->',
                `<script>const playerKey = '${keyword}'; const urlApiMaster = '${urlApiMaster}'; const URLAPI = '${URLAPI}'</script>`
            )
            .replace(
                '<base href="URLBASE">',
                `<base href="${URLAPI}/public/player1">`
            );

            res.send(modifiedHtml);
        });
    };

    getPlayerPublic = async (req, res) => {
        const { guid } = req.body;
        const keyword = await getKeywordByGuid(guid);    // endpoint do service e da controller       
        const urlApiMaster = URLAPI+'/uploads/packages/';
        const htmlPath = path.join(__dirname, '../../public/player1/index.html');

        

        fs.readFile(htmlPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo HTML:', err);
                return res.status(500).send('Erro ao carregar o player.');
            }

            const modifiedHtml = data.replace(
                '<!--KEY_PLACEHOLDER-->',
                `<script>const playerKey = '${keyword}'; const urlApiMaster = '${urlApiMaster}'; const URLAPI = '${URLAPI}'</script>`
            )
            .replace(
                '<base href="URLBASE">',
                `<base href="${URLAPI}/public/player1">`
            );

            res.send(modifiedHtml);
        });
    };
}

module.exports = new PlayerController();
