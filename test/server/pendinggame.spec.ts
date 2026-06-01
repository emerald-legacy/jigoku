import PendingGame from '../../server/PendingGame.js';


function makeOwner(overrides?: any) {
    return {
        username: 'owner',
        emailHash: 'abc',
        blockList: [],
        settings: {},
        ...overrides
    };
}

function makeDetails(overrides?: any) {
    return {
        name: 'Test Game',
        spectators: true,
        spectatorSquelch: false,
        gameType: 'competitive',
        clocks: { type: 'none' },
        ...overrides
    };
}

function makeUser(username: string, overrides?: any) {
    return {
        username,
        emailHash: `hash-${username}`,
        blockList: [],
        settings: {},
        ...overrides
    };
}

describe('PendingGame', () => {
    let game: any;
    let owner: any;

    beforeEach(() => {
        owner = makeOwner();
        game = new PendingGame(owner, makeDetails());
    });

    describe('constructor', () => {
        it('sets owner', () => {
            expect(game.owner).toBe(owner);
        });

        it('initialises players as empty object', () => {
            expect(game.players).toEqual({});
        });

        it('initialises spectators as empty object', () => {
            expect(game.spectators).toEqual({});
        });

        it('sets id from uuid.v1 (truthy string)', () => {
            expect(typeof game.id).toBe('string');
            expect(game.id.length).toBeGreaterThan(0);
        });

        it('sets name from details', () => {
            expect(game.name).toBe('Test Game');
        });

        it('sets allowSpectators from details.spectators', () => {
            expect(game.allowSpectators).toBe(true);
        });

        it('sets spectatorSquelch', () => {
            expect(game.spectatorSquelch).toBe(false);
        });

        it('sets gameType', () => {
            expect(game.gameType).toBe('competitive');
        });

        it('sets clocks', () => {
            expect(game.clocks).toEqual({ type: 'none' });
        });

        it('sets createdAt to a Date', () => {
            expect(game.createdAt).toBeInstanceOf(Date);
        });

        it('sets node to null', () => {
            expect(game.node).toBeNull();
        });

        it('sets started to false', () => {
            expect(game.started).toBe(false);
        });

        it('creates gameChat instance', () => {
            expect(game.gameChat).toBeDefined();
        });
    });

    describe('getPlayers()', () => {
        it('returns empty object initially', () => {
            expect(game.getPlayers()).toEqual({});
        });

        it('returns players after addPlayer', () => {
            const user = makeUser('alice');
            game.addPlayer('id1', user);
            expect(game.getPlayers()['alice']).toBeDefined();
        });
    });

    describe('getPlayerOrSpectator()', () => {
        it('returns undefined when not present', () => {
            expect(game.getPlayerOrSpectator('nobody')).toBeUndefined();
        });

        it('returns player by name', () => {
            const user = makeUser('alice');
            game.addPlayer('id1', user);
            expect(game.getPlayerOrSpectator('alice')).toBeDefined();
        });

        it('returns spectator by name', () => {
            const user = makeUser('bob');
            game.addSpectator('id2', user);
            expect(game.getPlayerOrSpectator('bob')).toBeDefined();
        });
    });

    describe('addPlayer()', () => {
        it('stores player with correct shape', () => {
            const user = makeUser('alice');
            game.addPlayer('socket-1', user);
            const p = game.players['alice'];
            expect(p.id).toBe('socket-1');
            expect(p.name).toBe('alice');
            expect(p.user).toBe(user);
            expect(p.emailHash).toBe('hash-alice');
            expect(p.owner).toBe(false);
        });

        it('sets owner=true when user is owner', () => {
            const ownerUser = makeUser('owner');
            game.addPlayer('s1', ownerUser);
            expect(game.players['owner'].owner).toBe(true);
        });
    });

    describe('addSpectator()', () => {
        it('stores spectator with correct shape', () => {
            const user = makeUser('bob');
            game.addSpectator('socket-2', user);
            const s = game.spectators['bob'];
            expect(s.id).toBe('socket-2');
            expect(s.name).toBe('bob');
            expect(s.user).toBe(user);
            expect(s.emailHash).toBe('hash-bob');
        });
    });

    describe('getSaveState()', () => {
        it('returns correct shape', () => {
            const user = makeUser('alice');
            game.addPlayer('s1', user);
            game.players['alice'].faction = { name: 'crab' };
            const state = game.getSaveState();
            expect(state.gameId).toBe(game.id);
            expect(state.gameType).toBe('competitive');
            expect(state.startedAt).toBe(game.createdAt);
            expect(state.players).toEqual([{ faction: 'crab', name: 'alice' }]);
        });
    });

    describe('isUserBlocked()', () => {
        it('returns false when blockList empty', () => {
            const user = makeUser('alice');
            expect(game.isUserBlocked(user)).toBe(false);
        });

        it('returns true when user in owner.blockList', () => {
            owner.blockList = ['alice'];
            const user = makeUser('Alice'); // case-insensitive check
            expect(game.isUserBlocked(user)).toBe(true);
        });

        it('returns false when user not in owner.blockList', () => {
            owner.blockList = ['charlie'];
            const user = makeUser('alice');
            expect(game.isUserBlocked(user)).toBe(false);
        });
    });

    describe('isOwner()', () => {
        it('returns false for unknown player', () => {
            expect(game.isOwner('nobody')).toBe(false);
        });

        it('returns true for owner player', () => {
            const ownerUser = makeUser('owner');
            game.addPlayer('s1', ownerUser);
            expect(game.isOwner('owner')).toBe(true);
        });

        it('returns false for non-owner player', () => {
            const user = makeUser('alice');
            game.addPlayer('s2', user);
            expect(game.isOwner('alice')).toBe(false);
        });
    });

    describe('hasActivePlayer()', () => {
        it('returns false for unknown name', () => {
            expect(game.hasActivePlayer('nobody')).toBeFalsy();
        });

        it('returns true for active player', () => {
            const user = makeUser('alice');
            game.addPlayer('s1', user);
            expect(game.hasActivePlayer('alice')).toBeTruthy();
        });

        it('returns false for player with left=true', () => {
            const user = makeUser('alice');
            game.addPlayer('s1', user);
            game.players['alice'].left = true;
            expect(game.hasActivePlayer('alice')).toBeFalsy();
        });

        it('returns false for player with disconnected=true', () => {
            const user = makeUser('alice');
            game.addPlayer('s1', user);
            game.players['alice'].disconnected = true;
            expect(game.hasActivePlayer('alice')).toBeFalsy();
        });

        it('returns truthy for active spectator', () => {
            const user = makeUser('bob');
            game.addSpectator('s2', user);
            expect(game.hasActivePlayer('bob')).toBeTruthy();
        });
    });

    describe('isEmpty()', () => {
        it('returns true when no players or spectators', () => {
            expect(game.isEmpty()).toBe(true);
        });

        it('returns false when there is an active player', () => {
            game.addPlayer('s1', makeUser('alice'));
            expect(game.isEmpty()).toBe(false);
        });

        it('returns true when only player has left (non-started)', () => {
            game.addPlayer('s1', makeUser('alice'));
            game.leave('alice');
            expect(game.isEmpty()).toBe(true);
        });
    });

    describe('leave()', () => {
        it('does nothing for unknown player', () => {
            expect(() => game.leave('nobody')).not.toThrow();
        });

        it('removes player from non-started game', () => {
            game.addPlayer('s1', makeUser('alice'));
            game.leave('alice');
            expect(game.players['alice']).toBeUndefined();
        });

        it('removes spectator', () => {
            game.addSpectator('s2', makeUser('bob'));
            game.leave('bob');
            expect(game.spectators['bob']).toBeUndefined();
        });

        it('marks player left in started game', () => {
            game.addPlayer('s1', makeUser('alice'));
            game.started = true;
            game.leave('alice');
            expect(game.players['alice']).toBeDefined();
            expect(game.players['alice'].left).toBe(true);
        });
    });

    describe('disconnect()', () => {
        it('does nothing for unknown player', () => {
            expect(() => game.disconnect('nobody')).not.toThrow();
        });

        it('removes player from non-started game', () => {
            game.addPlayer('s1', makeUser('alice'));
            game.disconnect('alice');
            expect(game.players['alice']).toBeUndefined();
        });

        it('removes spectator on disconnect', () => {
            game.addSpectator('s2', makeUser('bob'));
            game.disconnect('bob');
            expect(game.spectators['bob']).toBeUndefined();
        });

        it('does not remove player in started game', () => {
            game.addPlayer('s1', makeUser('alice'));
            game.started = true;
            game.disconnect('alice');
            expect(game.players['alice']).toBeDefined();
        });
    });
});
