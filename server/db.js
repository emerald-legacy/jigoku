/**
 * MongoDB 6 database connection
 */
const { MongoClient, ObjectId } = require('mongodb');
const { logger } = require('./logger');

let client = null;
let db = null;
let connectPromise = null;

/**
 * Connect to MongoDB and return the database instance
 */
async function connect(url) {
    if(db) {
        return db;
    }

    if(connectPromise) {
        return connectPromise;
    }

    connectPromise = (async () => {
        try {
            client = new MongoClient(url, { maxPoolSize: 10 });
            await client.connect();

            const urlObj = new URL(url);
            const dbName = urlObj.pathname.slice(1) || 'ringteki';

            db = client.db(dbName);
            logger.info('Connected to MongoDB');
            return db;
        } catch(err) {
            connectPromise = null;
            logger.error('MongoDB connection error:', err);
            throw err;
        }
    })();

    return connectPromise;
}

/**
 * Close the database connection
 */
async function close() {
    if(client) {
        await client.close();
        client = null;
        db = null;
        connectPromise = null;
    }
}

/**
 * Get the database instance (must call connect first)
 * Throws if not connected yet
 */
function getDb() {
    if(!db) {
        throw new Error('Database not connected. Call connect() first.');
    }
    return db;
}

/**
 * Convert string ID to ObjectId if valid
 */
function toObjectId(id) {
    if(id instanceof ObjectId) {
        return id;
    }
    if(typeof id === 'string' && ObjectId.isValid(id)) {
        return new ObjectId(id);
    }
    return id;
}

module.exports = {
    connect,
    close,
    getDb,
    toObjectId,
    ObjectId
};
