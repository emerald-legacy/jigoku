const { logger } = require('../logger');

class MessageService {
    constructor(db) {
        this.messages = db.collection('messages');
    }

    async addMessage(message) {
        try {
            const result = await this.messages.insertOne(message);
            return { ...message, _id: result.insertedId };
        } catch(err) {
            logger.error('Unable to insert message', err);
            throw new Error('Unable to insert message');
        }
    }

    async getLastMessages() {
        return this.messages.find({}).sort({ time: -1 }).limit(150).toArray();
    }
}

module.exports = MessageService;
