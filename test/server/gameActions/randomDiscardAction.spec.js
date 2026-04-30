const { RandomDiscardAction } = require('../../../build/server/game/GameActions/RandomDiscardAction.js');

describe('RandomDiscardAction', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['addMessage']);
        this.player = jasmine.createSpyObj('player', ['moveCard', 'checkRestrictions']);
        this.player.type = 'player';
        this.player.checkRestrictions.and.returnValue(true);
        this.player.game = this.game;
        this.context = { player: this.player, gameActionsResolutionChain: [] };
    });

    describe('canAffect()', function() {
        describe('when hand is empty', function() {
            beforeEach(function() {
                this.player.hand = [];
                this.action = new RandomDiscardAction({ amount: 1, target: [this.player] });
            });

            it('should return false', function() {
                expect(this.action.canAffect(this.player, this.context)).toBe(false);
            });
        });

        describe('when amount is 0', function() {
            beforeEach(function() {
                this.player.hand = [{ name: 'Card A' }];
                this.action = new RandomDiscardAction({ amount: 0, target: [this.player] });
            });

            it('should return false', function() {
                expect(this.action.canAffect(this.player, this.context)).toBe(false);
            });
        });

        describe('when hand has cards and amount > 0', function() {
            beforeEach(function() {
                this.player.hand = [{ name: 'Card A' }, { name: 'Card B' }];
                this.action = new RandomDiscardAction({ amount: 1, target: [this.player] });
            });

            it('should return true', function() {
                expect(this.action.canAffect(this.player, this.context)).toBe(true);
            });
        });
    });

    describe('eventHandler()', function() {
        beforeEach(function() {
            this.cardA = { name: 'Card A', isDynasty: false };
            this.cardB = { name: 'Card B', isDynasty: false };
            this.cardC = { name: 'Card C', isDynasty: false };
            this.player.hand = [this.cardA, this.cardB, this.cardC];
            this.event = { player: this.player, amount: 2 };
        });

        it('should discard the requested number of cards', function() {
            this.action = new RandomDiscardAction({ amount: 2, target: [this.player] });
            this.action.eventHandler(this.event);
            expect(this.event.cards.length).toBe(2);
        });

        it('should cap amount at hand size', function() {
            this.event.amount = 10;
            this.action = new RandomDiscardAction({ amount: 10, target: [this.player] });
            this.action.eventHandler(this.event);
            expect(this.event.cards.length).toBe(3);
        });

        it('should set discardedCards to the discarded cards', function() {
            this.action = new RandomDiscardAction({ amount: 1, target: [this.player] });
            this.event.amount = 1;
            this.action.eventHandler(this.event);
            expect(this.event.discardedCards).toBe(this.event.cards);
        });

        it('should move each discarded card to the conflict discard pile', function() {
            this.action = new RandomDiscardAction({ amount: 2, target: [this.player] });
            this.action.eventHandler(this.event);
            expect(this.player.moveCard.calls.count()).toBe(2);
        });

        it('should move dynasty cards to dynasty discard pile', function() {
            this.cardA.isDynasty = true;
            this.player.hand = [this.cardA];
            this.event.amount = 1;
            this.action = new RandomDiscardAction({ amount: 1, target: [this.player] });
            this.action.eventHandler(this.event);
            expect(this.player.moveCard).toHaveBeenCalledWith(this.cardA, 'dynasty discard pile');
        });

        it('should move non-dynasty cards to conflict discard pile', function() {
            this.cardA.isDynasty = false;
            this.player.hand = [this.cardA];
            this.event.amount = 1;
            this.action = new RandomDiscardAction({ amount: 1, target: [this.player] });
            this.action.eventHandler(this.event);
            expect(this.player.moveCard).toHaveBeenCalledWith(this.cardA, 'conflict discard pile');
        });

        it('should log the discard message', function() {
            this.action = new RandomDiscardAction({ amount: 1, target: [this.player] });
            this.event.amount = 1;
            this.action.eventHandler(this.event);
            expect(this.game.addMessage).toHaveBeenCalled();
        });

        describe('when amount is 0', function() {
            beforeEach(function() {
                this.player.hand = [];
                this.event.amount = 0;
                this.action = new RandomDiscardAction({ amount: 0, target: [this.player] });
            });

            it('should not move any cards', function() {
                this.action.eventHandler(this.event);
                expect(this.player.moveCard).not.toHaveBeenCalled();
            });
        });
    });
});
