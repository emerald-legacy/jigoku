const { logger } = require('../logger');

class GameService {
    constructor(db) {
        this.games = db.collection('games');
    }

    async create(game) {
        try {
            const result = await this.games.insertOne(game);
            return { ...game, _id: result.insertedId };
        } catch(err) {
            logger.error('Unable to create game', err);
            throw new Error('Unable to create game');
        }
    }

    async update(game) {
        const properties = {
            startedAt: game.startedAt,
            players: game.players,
            winner: game.winner,
            winReason: game.winReason,
            finishedAt: game.finishedAt
        };
        try {
            return await this.games.updateOne({ gameId: game.gameId }, { $set: properties });
        } catch(err) {
            logger.error('Unable to update game', err);
            throw new Error('Unable to update game');
        }
    }

    async getAllGames(from, to) {
        try {
            const games = await this.games.find().toArray();
            return games.filter(game => game.startedAt >= from && game.startedAt < to);
        } catch(err) {
            logger.error('Unable to get all games from', from, 'to', to, err);
            throw new Error('Unable to get all games');
        }
    }
}

module.exports = GameService;
