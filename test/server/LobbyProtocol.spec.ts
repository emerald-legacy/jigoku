import fs from 'fs';
import path from 'path';
import { DeckSchema, PendingGameSchema } from '../../server/gamenode/LobbyProtocol.js';
import { CardDataSchema } from '../../server/game/types/CardData.js';
import { ClockType } from '../../server/game/Clocks/ClockSelector.js';

const cardDirectory = path.join(process.cwd(), 'test/json/Card');

function allCardData(): unknown[] {
    return fs.readdirSync(cardDirectory)
        .filter((file) => file.endsWith('.json'))
        .flatMap((file): unknown[] => JSON.parse(fs.readFileSync(path.join(cardDirectory, file), 'utf8')));
}

describe('LobbyProtocol schemas', function() {
    it('accept the data of every card', function() {
        const rejected = allCardData().filter((card) => !CardDataSchema.safeParse(card).success);
        expect(rejected).toEqual([]);
    });

    it('keep fields the engine does not read', function() {
        const parsed = CardDataSchema.parse({ id: 'a', name: 'A', type: 'event', name_extra: 'x' });
        expect(parsed).toEqual(jasmine.objectContaining({ name_extra: 'x' }));
    });

    it('accept a deck whose card data is missing', function() {
        const deck = { _id: 'd1', faction: { name: 'Crab Clan', value: 'crab' }, conflictCards: [{ count: 3 }] };
        expect(DeckSchema.safeParse(deck).success).toBe(true);
    });

    it('count a deck entry without a count as none, as the deck used to', function() {
        const deck = DeckSchema.parse({ conflictCards: [{ card: { id: 'a', name: 'A', type: 'event' } }] });
        expect(deck.conflictCards?.[0].count).toBe(0);
    });

    it('drop invalid deck entries and card data without failing the deck', function() {
        const deck = DeckSchema.parse({
            faction: null,
            conflictCards: [null, { count: 2, card: { id: 'a', name: 'A', type: 'event', glory: {}, traits: ['x', 3] } }, { count: 1, card: { name: 'no id' } }],
            dynastyCards: 'not a list',
            outsideTheGameCards: [{ id: 'b', name: 'B', type: 'character' }, 'junk']
        });
        expect(deck.faction).toBeUndefined();
        expect(deck.conflictCards?.length).toBe(2);
        expect(deck.conflictCards?.[0].card).toEqual(jasmine.objectContaining({ id: 'a', glory: null, traits: ['x'] }));
        expect(deck.conflictCards?.[1].card).toBeNull();
        expect(deck.dynastyCards).toBeUndefined();
        expect(deck.outsideTheGameCards?.length).toBe(1);
    });

    it('require only id, name and type of a card', function() {
        expect(CardDataSchema.safeParse({ id: 'a', name: 'A' }).success).toBe(false);
        expect(CardDataSchema.safeParse({ id: 'a', name: 'A', type: 'event', side: 7, elements: 'fire', versions: null }).success).toBe(true);
    });

    it('treat malformed user settings and clocks as unset', function() {
        const parsed = PendingGameSchema.parse({
            id: 'g1',
            name: 'Game',
            owner: 'alice',
            allowSpectators: true,
            clocks: { type: 'sundial', time: '30', periods: 0, timePeriod: 0 },
            players: { alice: { id: 'p1', name: 'alice', user: { username: 'alice', settings: { optionSettings: 'yes', windowTimer: '10' } } } },
            spectators: {}
        });
        expect(parsed.clocks).toEqual(jasmine.objectContaining({ type: ClockType.NONE, time: 30 }));
        expect(parsed.players.alice.user.settings?.optionSettings).toBeUndefined();
        expect(parsed.players.alice.user.settings?.windowTimer).toBe('10');
    });

    it('accept null for every optional game field', function() {
        const parsed = PendingGameSchema.parse({
            id: 'g1',
            name: 'Game',
            owner: 'alice',
            allowSpectators: null,
            spectatorSquelch: null,
            gameType: null,
            gameMode: null,
            clocks: null,
            password: null,
            savedGameId: null,
            players: { alice: { id: 'p1', name: 'alice', user: { username: 'alice', emailHash: null, settings: null }, deck: null } },
            spectators: null
        });
        expect(parsed.gameMode).toBeUndefined();
        expect(parsed.clocks).toBeUndefined();
        expect(parsed.allowSpectators).toBe(false);
        expect(parsed.spectators).toEqual({});
        expect(parsed.players.alice.deck).toBeUndefined();
    });

    it('treat malformed clocks as absent', function() {
        const game = { id: 'g1', name: 'Game', owner: 'alice', allowSpectators: true, players: {}, spectators: {} };
        expect(PendingGameSchema.parse({ ...game, clocks: 'sixty minutes' }).clocks).toBeUndefined();
    });

    it('drop a malformed spectator but keep the game', function() {
        const parsed = PendingGameSchema.parse({
            id: 'g1', name: 'Game', owner: 'alice', allowSpectators: true, players: {},
            spectators: { bob: { id: 's1', user: { username: 'bob' } }, eve: { id: 's2' } }
        });
        expect(Object.keys(parsed.spectators)).toEqual(['bob']);
    });

    it('still reject a player without a username', function() {
        const game = { id: 'g1', name: 'Game', owner: 'alice', players: { alice: { id: 'p1', name: 'alice', user: {} } } };
        expect(PendingGameSchema.safeParse(game).success).toBe(false);
    });
});
