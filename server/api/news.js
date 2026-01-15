const db = require('../db.js');
const NewsService = require('../services/NewsService.js');
const { logger } = require('../logger');

module.exports.init = function (server) {
    const newsService = new NewsService(db.getDb());

    server.get('/api/news', async function (req, res) {
        try {
            const news = await newsService.getRecentNewsItems({ limit: req.query.limit });
            res.send({ success: true, news: news });
        } catch(err) {
            logger.error(err);
            res.send({ success: false, message: 'Error loading news' });
        }
    });

    server.put('/api/news', async function (req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        if(!req.user.permissions || !req.user.permissions.canEditNews) {
            return res.status(403).send({ message: 'Forbidden' });
        }

        try {
            await newsService.addNews({
                poster: req.user.username,
                text: req.body.text,
                datePublished: new Date()
            });
            res.send({ success: true });
        } catch(err) {
            logger.error(err);
            res.send({ success: false, message: 'Error saving news item' });
        }
    });
};
