const { MatchingDiscardAction } = require('../../../build/server/game/GameActions/MatchingDiscardAction.js');

describe('MatchingDiscardAction', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['addMessage']);
        this.player = jasmine.createSpyObj('player', ['moveCard', 'checkRestrictions']);
        this.player.type = 'player';
        this.player.checkRestrictions.and.returnValue(true);
        this.player.game = this.game;
        this.cardA = { name: 'Iron Will', isDynasty: false };
        this.cardB = { name: 'Iron Will', isDynasty: false };
        this.cardC = { name: 'Banzai!', isDynasty: false };
        this.player.hand = [this.cardA, this.cardB, this.cardC];
        this.context = { player: this.player, gameActionsResolutionChain: [] };
    });

    describe('canAffect()', function() {
        describe('when hand is empty', function() {
            beforeEach(function() {
                this.player.hand = [];
                this.action = new MatchingDiscardAction({ target: [this.player], cards: [], match: () => true });
            });

            it('should return false', function() {
                expect(this.action.canAffect(this.player, this.context)).toBe(false);
            });
        });

        describe('when hand has cards', function() {
            beforeEach(function() {
                this.action = new MatchingDiscardAction({ target: [this.player], cards: [this.cardA], match: () => true });
            });

            it('should return true', function() {
                expect(this.action.canAffect(this.player, this.context)).toBe(true);
            });
        });
    });

    describe('eventHandler()', function() {
        describe('when all cards match', function() {
            beforeEach(function() {
                this.event = {
                    player: this.player,
                    context: this.context,
                    amount: -1,
                    reveal: false,
                    cards: [this.cardA, this.cardB],
                    match: () => true
                };
                this.action = new MatchingDiscardAction({});
            });

            it('should discard all matching cards', function() {
                this.action.eventHandler(this.event);
                expect(this.event.cards.length).toBe(2);
                expect(this.player.moveCard.calls.count()).toBe(2);
            });

            it('should set discardedCards', function() {
                this.action.eventHandler(this.event);
                expect(this.event.discardedCards).toEqual(this.event.cards);
            });
        });

        describe('when some cards match by name', function() {
            beforeEach(function() {
                this.event = {
                    player: this.player,
                    context: this.context,
                    amount: -1,
                    reveal: false,
                    cards: [this.cardA, this.cardB, this.cardC],
                    match: (_context, card) => card.name === 'Iron Will'
                };
                this.action = new MatchingDiscardAction({});
            });

            it('should only discard matching cards', function() {
                this.action.eventHandler(this.event);
                expect(this.event.cards.length).toBe(2);
                expect(this.event.cards).toContain(this.cardA);
                expect(this.event.cards).toContain(this.cardB);
                expect(this.event.cards).not.toContain(this.cardC);
            });
        });

        describe('when no cards match', function() {
            beforeEach(function() {
                this.event = {
                    player: this.player,
                    context: this.context,
                    amount: -1,
                    reveal: false,
                    cards: [this.cardA, this.cardB, this.cardC],
                    match: () => false
                };
                this.action = new MatchingDiscardAction({});
            });

            it('should discard nothing', function() {
                this.action.eventHandler(this.event);
                expect(this.player.moveCard).not.toHaveBeenCalled();
            });

            it('should log a does-not-discard message', function() {
                this.action.eventHandler(this.event);
                expect(this.game.addMessage).toHaveBeenCalledWith('{0} does not discard anything', this.player);
            });
        });

        describe('when amount limits matching cards', function() {
            beforeEach(function() {
                this.event = {
                    player: this.player,
                    context: this.context,
                    amount: 1,
                    reveal: false,
                    cards: [this.cardA, this.cardB],
                    match: () => true
                };
                this.action = new MatchingDiscardAction({});
            });

            it('should discard only up to amount', function() {
                this.action.eventHandler(this.event);
                expect(this.event.cards.length).toBe(1);
                expect(this.player.moveCard.calls.count()).toBe(1);
            });
        });

        describe('when reveal is true', function() {
            beforeEach(function() {
                this.event = {
                    player: this.player,
                    context: this.context,
                    amount: -1,
                    reveal: true,
                    cards: [this.cardA, this.cardB],
                    match: () => true
                };
                this.action = new MatchingDiscardAction({});
            });

            it('should call addMessage to reveal cards', function() {
                this.action.eventHandler(this.event);
                expect(this.game.addMessage).toHaveBeenCalledWith('{0} reveals {1}', this.player, [this.cardA, this.cardB]);
            });
        });

        describe('when amount is 0', function() {
            beforeEach(function() {
                this.player.hand = [];
                this.event = {
                    player: this.player,
                    context: this.context,
                    amount: 0,
                    reveal: false,
                    cards: [],
                    match: () => true
                };
                this.action = new MatchingDiscardAction({});
            });

            it('should not move any cards', function() {
                this.action.eventHandler(this.event);
                expect(this.player.moveCard).not.toHaveBeenCalled();
            });
        });

        describe('dynasty card routing', function() {
            beforeEach(function() {
                this.dynastyCard = { name: 'Kitsuki Investigator', isDynasty: true };
                this.player.hand = [this.dynastyCard];
                this.event = {
                    player: this.player,
                    context: this.context,
                    amount: -1,
                    reveal: false,
                    cards: [this.dynastyCard],
                    match: () => true
                };
                this.action = new MatchingDiscardAction({});
            });

            it('should move dynasty cards to dynasty discard pile', function() {
                this.action.eventHandler(this.event);
                expect(this.player.moveCard).toHaveBeenCalledWith(this.dynastyCard, 'dynasty discard pile');
            });
        });
    });
});
