import TriggeredAbility from '../../../server/game/triggeredability.js';
import { AbilityTypes } from '../../../server/game/Constants.js';

interface TriggeredAbilityTestContext {
    gameSpy: any;
    cardSpy: any;
    player: any;
    properties: any;
    reaction: TriggeredAbility;
    event: any;
    window: any;
    context: any;
    spy1: jasmine.Spy;
    spy2: jasmine.Spy;
    executeEventHandler: () => void;
}

describe('TriggeredAbility', function () {
    beforeEach(function (this: TriggeredAbilityTestContext) {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'registerAbility', 'getPlayers']);
        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'isBlank', 'canTriggerAbilities', 'anyEffect']);
        this.cardSpy.game = this.gameSpy;
        this.player = { name: 'player1', playableLocations: [], findPlayType: () => undefined };
        this.cardSpy.controller = this.player;
        this.gameSpy.getPlayers.and.returnValue([this.player]);
        this.cardSpy.anyEffect.and.returnValue([]);

        this.properties = {
            when: {
                onSomething: jasmine.createSpy('when condition')
            },
            handler: jasmine.createSpy('handler')
        };

        this.properties.when.onSomething.and.returnValue(true);

        this.reaction = new TriggeredAbility(this.cardSpy, AbilityTypes.Reaction, this.properties);
        this.cardSpy.reactions = [this.reaction];
    });

    describe('eventHandler()', function() {
        beforeEach(function(this: TriggeredAbilityTestContext) {
            this.executeEventHandler = (): void => {
                this.event = { name: 'onSomething' };
                this.window = jasmine.createSpyObj('window', ['addChoice']);
                this.reaction.eventHandler(this.event, this.window);
                this.context = this.reaction.createContext(this.player, this.event);
            };
        });

        it('should call the when handler with the appropriate arguments', function(this: TriggeredAbilityTestContext) {
            this.executeEventHandler();
            expect(this.properties.when.onSomething).toHaveBeenCalledWith(this.event, this.context);
        });

        describe('when the when condition returns false', function() {
            beforeEach(function(this: TriggeredAbilityTestContext) {
                this.properties.when.onSomething.and.returnValue(false);
                this.executeEventHandler();
            });

            it('should not register the ability', function(this: TriggeredAbilityTestContext) {
                expect(this.window.addChoice).not.toHaveBeenCalled();
            });
        });

        describe('when the when condition returns true', function() {
            beforeEach(function(this: TriggeredAbilityTestContext) {
                this.spy1 = spyOn(this.reaction, 'meetsRequirements');
                this.spy1.and.returnValue('');
                this.spy2 = spyOn(this.reaction, 'isInValidLocation');
                this.spy2.and.returnValue(true);
                this.properties.when.onSomething.and.returnValue(true);
                this.executeEventHandler();
            });

            it('should register the ability', function(this: TriggeredAbilityTestContext) {
                expect(this.window.addChoice).toHaveBeenCalledWith(this.context);
            });
        });
    });

    describe('registerEvents()', function() {
        beforeEach(function(this: TriggeredAbilityTestContext) {
            this.properties = {
                when: {
                    onFoo: () => true,
                    onBar: () => true
                },
                handler: () => true
            };
            this.reaction = new TriggeredAbility(this.cardSpy, AbilityTypes.Reaction, this.properties);
            this.reaction.registerEvents();
        });

        it('should register all when event handlers with the proper event type suffix', function(this: TriggeredAbilityTestContext) {
            expect(this.gameSpy.on).toHaveBeenCalledWith('onFoo:reaction', jasmine.any(Function));
            expect(this.gameSpy.on).toHaveBeenCalledWith('onBar:reaction', jasmine.any(Function));
        });

        it('should not reregister events already registered', function(this: TriggeredAbilityTestContext) {
            expect(this.gameSpy.on.calls.count()).toBe(4);
            this.reaction.registerEvents();
            expect(this.gameSpy.on.calls.count()).toBe(4);
        });
    });

    describe('unregisterEvents', function() {
        beforeEach(function(this: TriggeredAbilityTestContext) {
            this.properties = {
                when: {
                    onFoo: () => true,
                    onBar: () => true
                },
                handler: () => true
            };
            this.reaction = new TriggeredAbility(this.cardSpy, AbilityTypes.Reaction, this.properties);
        });

        it('should unregister all previously registered when event handlers', function(this: TriggeredAbilityTestContext) {
            this.reaction.registerEvents();
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith('onFoo:reaction', jasmine.any(Function));
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith('onBar:reaction', jasmine.any(Function));
        });

        it('should not remove listeners when they have not been registered', function(this: TriggeredAbilityTestContext) {
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener).not.toHaveBeenCalled();
        });

        it('should not unregister events already unregistered', function(this: TriggeredAbilityTestContext) {
            this.reaction.registerEvents();
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener.calls.count()).toBe(2);
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener.calls.count()).toBe(2);
        });
    });
});
