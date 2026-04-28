import * as db from '../../server/db';
import { MongoClient, ObjectId } from 'mongodb';

// Spy on MongoClient
let mockDb: any;
let mockClient: any;

describe('db', () => {
    beforeEach(() => {
        mockDb = jasmine.createSpyObj('Db', ['collection']);
        mockClient = jasmine.createSpyObj('MongoClient', ['connect', 'close', 'db']);
        mockClient.db.and.returnValue(mockDb);
        (spyOn(MongoClient.prototype, 'connect') as jasmine.Spy).and.callFake(() => Promise.resolve());
        (spyOn(MongoClient.prototype, 'close') as jasmine.Spy).and.callFake(() => Promise.resolve());
        spyOn(MongoClient.prototype, 'db').and.returnValue(mockDb);
    });

    afterEach(async () => {
        await db.close();
    });

    describe('connect()', () => {
        it('connects and returns db', async () => {
            const result = await db.connect('mongodb://localhost/testdb');
            expect(result).toBe(mockDb);
        });

        it('returns cached db on second call (no new connection)', async () => {
            await db.connect('mongodb://localhost/testdb');
            const connectCallCount = (MongoClient.prototype.connect as jasmine.Spy).calls.count();
            await db.connect('mongodb://localhost/testdb');
            expect((MongoClient.prototype.connect as jasmine.Spy).calls.count()).toBe(connectCallCount);
        });

        it('caches in-flight promise — concurrent calls share one connection', async () => {
            const p1 = db.connect('mongodb://localhost/testdb');
            const p2 = db.connect('mongodb://localhost/testdb');
            await Promise.all([p1, p2]);
            expect((MongoClient.prototype.connect as jasmine.Spy).calls.count()).toBe(1);
        });
    });

    describe('getDb()', () => {
        it('throws when not connected', () => {
            expect(() => db.getDb()).toThrowError('Database not connected. Call connect() first.');
        });

        it('returns db after connect', async () => {
            await db.connect('mongodb://localhost/testdb');
            expect(db.getDb()).toBe(mockDb);
        });
    });

    describe('close()', () => {
        it('resets state so getDb throws after close', async () => {
            await db.connect('mongodb://localhost/testdb');
            await db.close();
            expect(() => db.getDb()).toThrowError('Database not connected. Call connect() first.');
        });

        it('calls client.close()', async () => {
            await db.connect('mongodb://localhost/testdb');
            await db.close();
            expect(MongoClient.prototype.close).toHaveBeenCalled();
        });

        it('is safe to call when not connected', async () => {
            await expectAsync(db.close()).toBeResolved();
        });
    });

    describe('toObjectId()', () => {
        it('converts valid 24-char hex string to ObjectId', () => {
            const id = 'a'.repeat(24);
            const result = db.toObjectId(id);
            expect(result).toBeInstanceOf(ObjectId);
            expect((result as ObjectId).toHexString()).toBe(id);
        });

        it('returns original ObjectId unchanged', () => {
            const oid = new ObjectId();
            expect(db.toObjectId(oid)).toBe(oid);
        });

        it('returns original string if not a valid ObjectId', () => {
            const bad = 'not-valid';
            expect(db.toObjectId(bad)).toBe(bad);
        });
    });
});
