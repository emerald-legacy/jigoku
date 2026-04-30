const { ChosenReturnToDeckAction } = require('../../../build/server/game/GameActions/ChosenReturnToDeckAction.js');

describe('ChosenReturnToDeckAction', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['addMessage', 'promptForSelect']);
        this.player = jasmine.createSpyObj('player', ['moveCard', 'shuffleConflictDeck', 'checkRestrictions']);
        this.player.type = 'player';
        this.player.checkRestrictions.and.returnValue(true);
        this.player.game = this.game;
        this.cardA = { name: 'Way of the Crane', owner: this.player };
        this.cardB = { name: 'Charge!', owner: this.player };
        this.player.hand = [this.cardA, this.cardB];
        this.context = { player: this.player, game: this.game, gameActionsResolutionChain: [] };
    });

    describe('canAffect()', function() {
        describe('when hand is empty', function() {
            beforeEach(function() {
                this.player.hand = [];
                this.action = new ChosenReturnToDeckAction({ amount: 1, target: [this.player] });
            });

            it('should return false', function() {
                expect(this.action.canAffect(this.player, this.context)).toBe(false);
            });
        });

        describe('when amount is 0', function() {
            beforeEach(function() {
                this.action = new ChosenReturnToDeckAction({ amount: 0, target: [this.player] });
            });

            it('should return false', function() {
                expect(this.action.canAffect(this.player, this.context)).toBe(false);
            });
        });

        describe('when hand has cards and amount > 0', function() {
            beforeEach(function() {
                this.action = new ChosenReturnToDeckAction({ amount: 1, target: [this.player] });
            });

            it('should return true', function() {
                expect(this.action.canAffect(this.player, this.context)).toBe(true);
            });
        });
    });

    describe('eventHandler()', function() {
        beforeEach(function() {
            this.event = {
                player: this.player,
                context: this.context,
                cards: [this.cardA, this.cardB],
                shuffle: false,
                bottom: false,
                options: { bottom: false }
            };
            this.action = new ChosenReturnToDeckAction({});
        });

        it('should move each card to the conflict deck', function() {
            this.action.eventHandler(this.event);
            expect(this.player.moveCard).toHaveBeenCalledWith(this.cardA, 'conflict deck', { bottom: false });
            expect(this.player.moveCard).toHaveBeenCalledWith(this.cardB, 'conflict deck', { bottom: false });
        });

        it('should set discardedCards', function() {
            this.action.eventHandler(this.event);
            expect(this.event.discardedCards).toBe(this.event.cards);
        });

        it('should log the return message', function() {
            this.action.eventHandler(this.event);
            expect(this.game.addMessage).toHaveBeenCalled();
        });

        describe('when shuffle is true', function() {
            beforeEach(function() {
                this.event.shuffle = true;
            });

            it('should shuffle the conflict deck after moving cards', function() {
                this.action.eventHandler(this.event);
                expect(this.player.shuffleConflictDeck).toHaveBeenCalled();
            });
        });

        describe('when shuffle is false', function() {
            it('should not shuffle the conflict deck', function() {
                this.action.eventHandler(this.event);
                expect(this.player.shuffleConflictDeck).not.toHaveBeenCalled();
            });
        });

        describe('when multiple card owners exist', function() {
            beforeEach(function() {
                this.owner2 = jasmine.createSpyObj('owner2', ['moveCard', 'shuffleConflictDeck']);
                this.cardC = { name: 'For Shame!', owner: this.owner2 };
                this.event.cards = [this.cardA, this.cardC];
                this.event.shuffle = true;
            });

            it('should shuffle each owner\'s deck once', function() {
                this.action.eventHandler(this.event);
                expect(this.player.shuffleConflictDeck.calls.count()).toBe(1);
                expect(this.owner2.shuffleConflictDeck.calls.count()).toBe(1);
            });
        });
    });

    describe('addEventsToArray()', function() {
        beforeEach(function() {
            this.events = [];
            this.action = new ChosenReturnToDeckAction({ amount: 2, targets: false, target: [this.player] });
            this.context.choosingPlayerOverride = null;
        });

        describe('when amount equals hand size', function() {
            beforeEach(function() {
                this.player.hand = [this.cardA, this.cardB];
            });

            it('should push one event without prompting', function() {
                this.action.addEventsToArray(this.events, this.context);
                expect(this.events.length).toBe(1);
                expect(this.game.promptForSelect).not.toHaveBeenCalled();
            });

            it('should include all hand cards in the event', function() {
                this.action.addEventsToArray(this.events, this.context);
                expect(this.events[0].cards).toEqual([this.cardA, this.cardB]);
            });
        });

        describe('when choosingPlayerOverride is set', function() {
            beforeEach(function() {
                this.otherPlayer = jasmine.createSpyObj('otherPlayer', ['checkRestrictions']);
                this.context.choosingPlayerOverride = this.otherPlayer;
                this.player.hand = [this.cardA, this.cardB, { name: 'Charge!', owner: this.player }];
                this.action = new ChosenReturnToDeckAction({ amount: 2, targets: true, target: [this.player] });
            });

            it('should randomly choose cards without prompting', function() {
                this.action.addEventsToArray(this.events, this.context);
                expect(this.events.length).toBe(1);
                expect(this.game.promptForSelect).not.toHaveBeenCalled();
                expect(this.events[0].cards.length).toBe(2);
            });
        });

        describe('when amount is 0', function() {
            beforeEach(function() {
                this.player.hand = [];
                this.action = new ChosenReturnToDeckAction({ amount: 1, targets: false, target: [this.player] });
            });

            it('should not push any events', function() {
                this.action.addEventsToArray(this.events, this.context);
                expect(this.events.length).toBe(0);
            });
        });
    });
});
