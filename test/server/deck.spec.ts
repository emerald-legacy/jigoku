import { Deck } from '../../server/game/Deck.js';
import DrawCard from '../../server/game/DrawCard.js';
import { ProvinceCard } from '../../server/game/ProvinceCard.js';
import { Location } from '../../server/game/Constants.js';
import type Player from '../../server/game/Player.js';
import type { CardClass } from '../../server/game/types/CardClass.js';

function makePlayer(cardLibrary: Map<string, CardClass>): Player {
    const game = jasmine.createSpyObj('game', ['raiseEvent', 'getCurrentAbilityContext', 'getFrameworkContext', 'on', 'removeListener']);
    game.getFrameworkContext.and.returnValue(null);
    game.cardLibrary = cardLibrary;
    game.gameMode = 'stronghold';
    const player = jasmine.createSpyObj('player', ['getCardSelectionState', 'allowGameAction', 'getShortSummary', 'checkRestrictions']);
    player.game = game;
    return player;
}

const conflictEvent = { id: 'test-event', name: 'Test Event', type: 'event', side: 'conflict' };

describe('Deck.prepare', function() {
    it('falls back to the base class for a card without an implementation', function() {
        const prepared = new Deck({ conflictCards: [{ count: 2, card: conflictEvent }] }).prepare(makePlayer(new Map()));
        expect(prepared.conflictCards.length).toBe(2);
        expect(prepared.conflictCards[0]).toEqual(jasmine.any(DrawCard));
        expect(prepared.conflictCards[0].location).toBe(Location.ConflictDeck);
    });

    it('rejects an implementation that is not the class its deck section needs', function() {
        const deck = new Deck({ conflictCards: [{ count: 1, card: conflictEvent }] });
        const player = makePlayer(new Map<string, CardClass>([['test-event', ProvinceCard]]));
        expect(() => deck.prepare(player)).toThrowError(/test-event/);
    });

    it('skips entries whose card data the lobby could not find', function() {
        const prepared = new Deck({ conflictCards: [{ count: 3 }] }).prepare(makePlayer(new Map()));
        expect(prepared.conflictCards).toEqual([]);
    });
});
