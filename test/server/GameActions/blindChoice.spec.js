import { chooseBlindly, isBlindChoice, selectBlindly } from '../../../build/server/game/GameActions/blindChoice.js';

describe('blindChoice', function() {
    beforeEach(function() {
        this.player = { name: 'player1' };
        this.hantei = { name: 'player2' };
        this.context = { choosingPlayerOverride: this.hantei };
        this.handA = { name: 'A', controller: this.player, location: 'hand' };
        this.handB = { name: 'B', controller: this.player, location: 'hand' };
        this.deckC = { name: 'C', controller: this.player, location: 'conflict deck' };
        this.inPlay = { name: 'D', controller: this.player, location: 'play area' };
        this.ownHand = { name: 'E', controller: this.hantei, location: 'hand' };
    });

    describe('isBlindChoice()', function() {
        it('is blind when every card is in another player\'s hand or deck', function() {
            expect(isBlindChoice(this.context, [this.handA, this.handB, this.deckC])).toBe(true);
        });

        it('is not blind when a card is visible to the chooser', function() {
            expect(isBlindChoice(this.context, [this.handA, this.inPlay])).toBe(false);
            expect(isBlindChoice(this.context, [this.ownHand])).toBe(false);
        });

        it('is not blind without a chooser taking over, or without cards', function() {
            expect(isBlindChoice({ choosingPlayerOverride: null }, [this.handA])).toBe(false);
            expect(isBlindChoice(this.context, [])).toBe(false);
        });
    });

    describe('chooseBlindly()', function() {
        it('chooses the amount of cards from those offered', function() {
            const chosen = chooseBlindly([this.handA, this.handB, this.deckC], 2, false);
            expect(chosen.length).toBe(2);
            chosen.forEach((card) => expect([this.handA, this.handB, this.deckC]).toContain(card));
        });

        it('chooses nothing when the cards must have certain properties', function() {
            expect(chooseBlindly([this.handA, this.handB], 1, true)).toEqual([]);
        });
    });

    describe('selectBlindly()', function() {
        beforeEach(function() {
            this.selector = {
                hasReachedLimit: (chosen) => chosen.length >= 2,
                wouldExceedLimit: () => false
            };
        });

        it('chooses as many cards as the selector takes', function() {
            expect(selectBlindly(this.selector, [this.handA, this.handB, this.deckC], this.context, false).length).toBe(2);
        });

        it('chooses nothing when the cards must have certain properties', function() {
            expect(selectBlindly(this.selector, [this.handA, this.handB], this.context, true)).toEqual([]);
        });
    });
});
