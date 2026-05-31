import { CardAction } from '../../../server/game/CardAction.js';

interface CardActionTestContext {
    gameSpy: any;
    cardSpy: any;
    limitSpy: any;
    properties: any;
    action: CardAction;
    context: any;
    handler: jasmine.Spy;
    player: any;
}

describe('CardAction', function () {
    beforeEach(function (this: CardActionTestContext) {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'raiseEvent', 'queueSimpleStep']);
        this.gameSpy.currentPhase = 'dynasty';

        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'isBlank', 'canTriggerAbilities']);
        this.cardSpy.game = this.gameSpy;
        this.cardSpy.canTriggerAbilities.and.returnValue(true);
        this.cardSpy.handler = function() {};
        this.cardSpy.abilities = { actions: [] };
        spyOn(this.cardSpy, 'handler').and.returnValue(true);

        this.limitSpy = jasmine.createSpyObj('limit', ['increment', 'isAtMax', 'registerEvents', 'unregisterEvents']);

        this.gameSpy.raiseEvent.and.callFake((_name: string, params: unknown, handler: (p: unknown) => void) => {
            if(handler) {
                handler(params);
            }
        });

        this.properties = {
            title: 'Do the thing',
            handler: this.cardSpy.handler
        };
    });

    describe('constructor', function() {
        describe('handler', function() {
            beforeEach(function(this: CardActionTestContext) {
                this.context = {
                    player: 'player',
                    arg: 'arg',
                    foo: 'bar'
                };
            });

            describe('when passed a handler directly', function() {
                beforeEach(function(this: CardActionTestContext) {
                    this.properties = {
                        title: 'Do the thing',
                        handler: jasmine.createSpy('handler')
                    };
                    this.action = new CardAction(this.cardSpy, this.properties);
                });

                it('should use the handler directly', function(this: CardActionTestContext) {
                    this.action.handler(this.context);
                    expect(this.properties.handler).toHaveBeenCalledWith(this.context);
                });
            });
        });

        describe('location', function() {
            it('should use the location sent via properties', function(this: CardActionTestContext) {
                this.properties.location = ['foo'];
                this.action = new CardAction(this.cardSpy, this.properties);
                expect(this.action.location as string[]).toContain('foo');
            });
        });

        describe('cost', function() {
            describe('when the card type is event', function() {
                beforeEach(function(this: CardActionTestContext) {
                    this.cardSpy.getType.and.returnValue('event');
                    this.properties.cost = ['foo'];
                    this.action = new CardAction(this.cardSpy, this.properties);
                });

                it('should add the reduced fate cost', function(this: CardActionTestContext) {
                    expect(this.action.cost.length).toBe(2);
                });
            });
        });

        describe('when there is no limit', function() {
            beforeEach(function(this: CardActionTestContext) {
                this.action = new CardAction(this.cardSpy, this.properties);
            });

            it('should not register an event', function(this: CardActionTestContext) {
                expect(this.limitSpy.registerEvents).not.toHaveBeenCalled();
            });
        });

        describe('when there is a limit', function() {
            beforeEach(function(this: CardActionTestContext) {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.cardSpy, this.properties);
            });

            it('should register events for the limit', function(this: CardActionTestContext) {
                expect(this.limitSpy.registerEvents).toHaveBeenCalledWith(this.gameSpy);
            });
        });
    });

    describe('executeHandler()', function() {
        beforeEach(function(this: CardActionTestContext) {
            this.player = { player: true };
            this.context = {
                game: this.gameSpy,
                player: this.player,
                source: this.cardSpy,
                arg: 'arg'
            };
            this.handler = jasmine.createSpy('handler');
            this.properties.handler = this.handler;
        });

        describe('when the action has no limit', function() {
            beforeEach(function(this: CardActionTestContext) {
                this.action = new CardAction(this.cardSpy, this.properties);
                this.action.executeHandler(this.context);
            });

            it('should call the handler', function(this: CardActionTestContext) {
                expect(this.handler).toHaveBeenCalledWith(this.context);
            });
        });

        describe('when the action has limited uses', function() {
            beforeEach(function(this: CardActionTestContext) {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.cardSpy, this.properties);
            });

            describe('and the handler returns false', function() {
                beforeEach(function(this: CardActionTestContext) {
                    this.handler.and.returnValue(false);
                    this.action.executeHandler(this.context);
                });

                it('should call the handler', function(this: CardActionTestContext) {
                    expect(this.handler).toHaveBeenCalledWith(this.context);
                });

                it('should not count towards the limit', function(this: CardActionTestContext) {
                    expect(this.limitSpy.increment).not.toHaveBeenCalled();
                });
            });

            describe('and the handler returns undefined or a non-false value', function() {
                beforeEach(function(this: CardActionTestContext) {
                    this.handler.and.returnValue(undefined);
                    this.action.executeHandler(this.context);
                });

                it('should call the handler', function(this: CardActionTestContext) {
                    expect(this.handler).toHaveBeenCalledWith(this.context);
                });
            });
        });
    });
});
