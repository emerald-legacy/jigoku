import Player from '../../../build/server/game/Player.js';
import { shuffle } from '../../../build/server/game/utils/shuffle.js';

describe('Player zone initialisation', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', [
            'getOtherPlayer',
            'emitEvent',
            'addMessage',
            'getProvinceArray'
        ]);
        this.gameSpy.getProvinceArray.and.returnValue([
            'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'
        ]);
        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
    });

    it('dynastyDeck starts as an empty array', function() {
        expect(Array.isArray(this.player.dynastyDeck)).toBe(true);
        expect(this.player.dynastyDeck.length).toBe(0);
    });

    it('conflictDeck starts as an empty array', function() {
        expect(Array.isArray(this.player.conflictDeck)).toBe(true);
        expect(this.player.conflictDeck.length).toBe(0);
    });

    it('hand starts as an empty array', function() {
        expect(Array.isArray(this.player.hand)).toBe(true);
        expect(this.player.hand.length).toBe(0);
    });

    it('cardsInPlay starts as an empty array', function() {
        expect(Array.isArray(this.player.cardsInPlay)).toBe(true);
        expect(this.player.cardsInPlay.length).toBe(0);
    });

    it('conflictDiscardPile starts as an empty array', function() {
        expect(Array.isArray(this.player.conflictDiscardPile)).toBe(true);
        expect(this.player.conflictDiscardPile.length).toBe(0);
    });

    it('dynastyDiscardPile starts as an empty array', function() {
        expect(Array.isArray(this.player.dynastyDiscardPile)).toBe(true);
        expect(this.player.dynastyDiscardPile.length).toBe(0);
    });

    it('removedFromGame starts as an empty array', function() {
        expect(Array.isArray(this.player.removedFromGame)).toBe(true);
        expect(this.player.removedFromGame.length).toBe(0);
    });

    it('provinceDeck starts as an empty array', function() {
        expect(Array.isArray(this.player.provinceDeck)).toBe(true);
        expect(this.player.provinceDeck.length).toBe(0);
    });

    it('underneathStronghold starts as an empty array', function() {
        expect(Array.isArray(this.player.underneathStronghold)).toBe(true);
        expect(this.player.underneathStronghold.length).toBe(0);
    });

    it('each province zone starts as an empty array', function() {
        expect(Array.isArray(this.player.provinceOne)).toBe(true);
        expect(Array.isArray(this.player.provinceTwo)).toBe(true);
        expect(Array.isArray(this.player.provinceThree)).toBe(true);
        expect(Array.isArray(this.player.provinceFour)).toBe(true);
        expect(Array.isArray(this.player.strongholdProvince)).toBe(true);
    });
});

describe('Player getSourceList', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', [
            'getOtherPlayer',
            'emitEvent',
            'addMessage',
            'getProvinceArray'
        ]);
        this.gameSpy.getProvinceArray.and.returnValue([
            'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'
        ]);
        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
    });

    it('returns the hand array for Locations.Hand', function() {
        expect(this.player.getSourceList('hand')).toBe(this.player.hand);
    });

    it('returns the conflictDeck array for Locations.ConflictDeck', function() {
        expect(this.player.getSourceList('conflict deck')).toBe(this.player.conflictDeck);
    });

    it('returns the dynastyDeck array for Locations.DynastyDeck', function() {
        expect(this.player.getSourceList('dynasty deck')).toBe(this.player.dynastyDeck);
    });

    it('returns the cardsInPlay array for Locations.PlayArea', function() {
        expect(this.player.getSourceList('play area')).toBe(this.player.cardsInPlay);
    });

    it('returns the conflictDiscardPile array', function() {
        expect(this.player.getSourceList('conflict discard pile')).toBe(this.player.conflictDiscardPile);
    });

    it('returns the dynastyDiscardPile array', function() {
        expect(this.player.getSourceList('dynasty discard pile')).toBe(this.player.dynastyDiscardPile);
    });

    it('returns the removedFromGame array', function() {
        expect(this.player.getSourceList('removed from game')).toBe(this.player.removedFromGame);
    });

    it('returns the provinceDeck array', function() {
        expect(this.player.getSourceList('province deck')).toBe(this.player.provinceDeck);
    });

    it('returns an empty array for an unknown location', function() {
        const result = this.player.getSourceList('');
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('returns a plain array for Locations.Provinces combining all province zones', function() {
        const cardA = { uuid: 'a' };
        const cardB = { uuid: 'b' };
        this.player.provinceOne.push(cardA);
        this.player.provinceTwo.push(cardB);
        const result = this.player.getSourceList('province');
        expect(result).toContain(cardA);
        expect(result).toContain(cardB);
    });

    it('creates an additional pile when source is unknown but non-empty', function() {
        const list = this.player.getSourceList('some custom pile');
        expect(Array.isArray(list)).toBe(true);
        expect(this.player.additionalPiles['some custom pile']).toBeDefined();
    });
});

describe('Player zone card operations', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', [
            'getOtherPlayer',
            'emitEvent',
            'addMessage',
            'getProvinceArray',
            'raiseEvent',
            'queueSimpleStep',
            'isDuringConflict'
        ]);
        this.gameSpy.getProvinceArray.and.returnValue([
            'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'
        ]);
        this.gameSpy.effectEngine = jasmine.createSpyObj('effectEngine', ['removeLastingEffects']);
        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
        this.player.initialise();
    });

    it('push adds a card to a zone', function() {
        const card = { uuid: 'x' };
        this.player.hand.push(card);
        expect(this.player.hand).toContain(card);
    });

    it('push increases zone length', function() {
        this.player.hand.push({ uuid: 'x' });
        expect(this.player.hand.length).toBe(1);
    });

    it('zone supports native array includes()', function() {
        const card = { uuid: 'z' };
        this.player.cardsInPlay.push(card);
        expect(this.player.cardsInPlay.includes(card)).toBe(true);
    });

    it('zone supports native array find()', function() {
        const card = { uuid: 'abc', name: 'Test' };
        this.player.conflictDeck.push(card);
        const found = this.player.conflictDeck.find((c) => c.uuid === 'abc');
        expect(found).toBe(card);
    });

    it('zone first element is accessible via index 0', function() {
        const card = { uuid: 'first' };
        this.player.dynastyDeck.unshift(card);
        expect(this.player.dynastyDeck[0]).toBe(card);
    });

    it('zone last element is accessible via at(-1)', function() {
        const card = { uuid: 'last' };
        this.player.dynastyDeck.push({ uuid: 'other' });
        this.player.dynastyDeck.push(card);
        expect(this.player.dynastyDeck.at(-1)).toBe(card);
    });
});

describe('Player isCardUuidInList and isCardNameInList', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', [
            'getOtherPlayer',
            'emitEvent',
            'addMessage',
            'getProvinceArray'
        ]);
        this.gameSpy.getProvinceArray.and.returnValue([]);
        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
        this.card = { uuid: 'card-1', name: 'Doji Challenger' };
        this.list = [this.card];
    });

    it('isCardUuidInList returns true when uuid matches', function() {
        expect(this.player.isCardUuidInList(this.list, this.card)).toBe(true);
    });

    it('isCardUuidInList returns false when uuid does not match', function() {
        expect(this.player.isCardUuidInList(this.list, { uuid: 'other', name: 'Other' })).toBe(false);
    });

    it('isCardNameInList returns true when name matches', function() {
        expect(this.player.isCardNameInList(this.list, this.card)).toBe(true);
    });

    it('isCardNameInList returns false when name does not match', function() {
        expect(this.player.isCardNameInList(this.list, { uuid: 'other', name: 'Other' })).toBe(false);
    });
});

describe('Player removeCardByUuid', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', [
            'getOtherPlayer',
            'emitEvent',
            'addMessage',
            'getProvinceArray'
        ]);
        this.gameSpy.getProvinceArray.and.returnValue([]);
        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
        this.cardA = { uuid: 'a', name: 'A' };
        this.cardB = { uuid: 'b', name: 'B' };
        this.list = [this.cardA, this.cardB];
    });

    it('returns a new array without the card with matching uuid', function() {
        const result = this.player.removeCardByUuid(this.list, 'a');
        expect(result).not.toContain(this.cardA);
    });

    it('retains cards whose uuid does not match', function() {
        const result = this.player.removeCardByUuid(this.list, 'a');
        expect(result).toContain(this.cardB);
    });

    it('does not mutate the original list', function() {
        this.player.removeCardByUuid(this.list, 'a');
        expect(this.list.length).toBe(2);
    });

    it('returns a plain array', function() {
        const result = this.player.removeCardByUuid(this.list, 'a');
        expect(Array.isArray(result)).toBe(true);
    });
});

describe('Player findCards', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', [
            'getOtherPlayer',
            'emitEvent',
            'addMessage',
            'getProvinceArray'
        ]);
        this.gameSpy.getProvinceArray.and.returnValue([]);
        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
    });

    it('returns cards that match the predicate', function() {
        const cards = [{ uuid: 'x', type: 'character' }, { uuid: 'y', type: 'event' }];
        const result = this.player.findCards(cards, (c) => c.type === 'character');
        expect(result.length).toBe(1);
        expect(result[0].uuid).toBe('x');
    });

    it('returns attachments that match the predicate', function() {
        const attachment = { uuid: 'att', type: 'attachment' };
        const card = { uuid: 'c', type: 'character', attachments: [attachment] };
        const result = this.player.findCards([card], (c) => c.type === 'attachment');
        expect(result).toContain(attachment);
    });

    it('returns empty array for null cardList', function() {
        const result = this.player.findCards(null, () => true);
        expect(result).toEqual([]);
    });
});

describe('shuffle utility', function() {
    it('returns a new array', function() {
        const arr = [1, 2, 3, 4, 5];
        const result = shuffle(arr);
        expect(result).not.toBe(arr);
    });

    it('does not mutate the input array', function() {
        const arr = [1, 2, 3, 4, 5];
        const original = arr.slice();
        shuffle(arr);
        expect(arr).toEqual(original);
    });

    it('returns an array with the same elements', function() {
        const arr = [1, 2, 3, 4, 5];
        const result = shuffle(arr);
        expect(result.sort()).toEqual(arr.slice().sort());
    });

    it('returns an array of the same length', function() {
        const arr = ['a', 'b', 'c'];
        expect(shuffle(arr).length).toBe(arr.length);
    });

    it('handles an empty array', function() {
        expect(shuffle([])).toEqual([]);
    });

    it('handles a single-element array', function() {
        expect(shuffle([42])).toEqual([42]);
    });
});
