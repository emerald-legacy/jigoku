const { logger } = require('../logger');
const { toObjectId } = require('../db.js');

class DeckService {
    constructor(db) {
        this.decks = db.collection('decks');
    }

    async getById(id) {
        try {
            return await this.decks.findOne({ _id: toObjectId(id) });
        } catch(err) {
            logger.error('Unable to fetch deck', err);
            throw new Error('Unable to fetch deck ' + id);
        }
    }

    async findByUserName(userName) {
        return this.decks.find({ username: userName }).sort({ lastUpdated: -1 }).toArray();
    }

    async create(deck) {
        const properties = {
            username: deck.username,
            name: deck.deckName,
            provinceCards: deck.provinceCards,
            stronghold: deck.stronghold,
            role: deck.role,
            conflictCards: deck.conflictCards,
            dynastyCards: deck.dynastyCards,
            faction: deck.faction,
            alliance: deck.alliance,
            lastUpdated: new Date()
        };

        const result = await this.decks.insertOne(properties);
        return { ...properties, _id: result.insertedId };
    }

    async update(deck) {
        const properties = {
            name: deck.deckName,
            provinceCards: deck.provinceCards,
            stronghold: deck.stronghold,
            role: deck.role,
            conflictCards: deck.conflictCards,
            dynastyCards: deck.dynastyCards,
            faction: deck.faction,
            alliance: deck.alliance,
            lastUpdated: new Date()
        };

        return this.decks.updateOne({ _id: toObjectId(deck.id) }, { $set: properties });
    }

    async delete(id) {
        return this.decks.deleteOne({ _id: toObjectId(id) });
    }
}

module.exports = DeckService;
