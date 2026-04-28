/**
 * MongoDB 6 database connection
 */
import { MongoClient, Db, ObjectId } from 'mongodb';
import { logger } from './logger';

let client: MongoClient | null = null;
let db: Db | null = null;
let connectPromise: Promise<Db> | null = null;

/**
 * Connect to MongoDB and return the database instance
 */
async function connect(url: string): Promise<Db> {
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
            const dbName = urlObj.pathname.slice(1) || 'jigoku';

            db = client.db(dbName);
            logger.info('Connected to MongoDB');
            return db;
        } catch(err) {
            connectPromise = null;
            if(client) {
                await client.close().catch(() => {});
                client = null;
            }
            logger.error('MongoDB connection error:', err);
            throw err;
        }
    })();

    return connectPromise;
}

/**
 * Close the database connection
 */
async function close(): Promise<void> {
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
function getDb(): Db {
    if(!db) {
        throw new Error('Database not connected. Call connect() first.');
    }
    return db;
}

/**
 * Convert string ID to ObjectId if valid
 */
function toObjectId(id: string | ObjectId): string | ObjectId {
    if(id instanceof ObjectId) {
        return id;
    }
    if(typeof id === 'string' && ObjectId.isValid(id)) {
        return new ObjectId(id);
    }
    return id;
}

export { connect, close, getDb, toObjectId, ObjectId };
