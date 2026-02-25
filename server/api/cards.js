const db = require('../db.js');
const CardService = require('../services/CardService.js');

module.exports.init = function (server) {
    const cardService = new CardService(db.getDb());

    server.get('/api/cards', async function (req, res, next) {
        try {
            const cards = await cardService.getAllCards({ shortForm: true });
            res.send({ success: true, cards: cards });
        } catch(err) {
            return next(err);
        }
    });

    server.get('/api/packs', async function (req, res, next) {
        try {
            const packs = await cardService.getAllPacks();
            res.send({ success: true, packs: packs });
        } catch(err) {
            return next(err);
        }
    });

    server.get('/api/factions', function (req, res) {
        const factions = [
            { name: 'Crab Clan', value: 'crab' },
            { name: 'Crane Clan', value: 'crane' },
            { name: 'Dragon Clan', value: 'dragon' },
            { name: 'Lion Clan', value: 'lion' },
            { name: 'Phoenix Clan', value: 'phoenix' },
            { name: 'Scorpion Clan', value: 'scorpion' },
            { name: 'Unicorn Clan', value: 'unicorn' }
        ];
        res.send({ success: true, factions: factions });
    });
};
