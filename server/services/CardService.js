const { logger } = require('../logger');

class CardService {
    constructor(db) {
        this.cards = db.collection('cards');
        this.packs = db.collection('packs');
    }

    async replaceCards(cards) {
        await this.cards.deleteMany({});
        if(cards.length > 0) {
            await this.cards.insertMany(cards);
        }
        return cards;
    }

    async replacePacks(packs) {
        await this.packs.deleteMany({});
        if(packs.length > 0) {
            await this.packs.insertMany(packs);
        }
        return packs;
    }

    async getAllCards(options) {
        try {
            const result = await this.cards.find({}).toArray();
            const cards = {};

            result.forEach(card => {
                if(options && options.shortForm) {
                    const { id, name, type, clan, side, deck_limit, elements, is_unique, influence_cost, influence_pool, pack_cards, role_restriction, allowed_clans } = card;
                    cards[card.id] = { id, name, type, clan, side, deck_limit, elements, is_unique, influence_cost, influence_pool, pack_cards, role_restriction, allowed_clans };
                } else {
                    cards[card.id] = card;
                }
            });

            return cards;
        } catch(err) {
            logger.info(err);
        }
    }

    async getAllPacks() {
        try {
            return await this.packs.find({}).toArray();
        } catch(err) {
            logger.info(err);
        }
    }
}

module.exports = CardService;
