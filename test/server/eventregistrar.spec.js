import { EventRegistrar } from '../../build/server/game/EventRegistrar.js';

describe('EventRegistrar', function () {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'off', 'onTriggerWindow', 'offTriggerWindow']);
        this.onRoundEnded = () => {};
        this.onCardBowed = () => {};
        this.events = new EventRegistrar(this.gameSpy);
    });

    describe('register()', function () {
        it('should register each handler for its game event', function() {
            this.events.register({ onRoundEnded: this.onRoundEnded, onCardBowed: this.onCardBowed });
            expect(this.gameSpy.on).toHaveBeenCalledWith('onRoundEnded', this.onRoundEnded);
            expect(this.gameSpy.on).toHaveBeenCalledWith('onCardBowed', this.onCardBowed);
        });

        it('should ignore keys that are no game event', function() {
            this.events.register({ notAnEvent: this.onRoundEnded });
            expect(this.gameSpy.on).not.toHaveBeenCalled();
        });
    });

    describe('registerTriggerWindow()', function () {
        it('should listen to the event in that trigger window', function() {
            this.events.registerTriggerWindow('onCardBowed', 'reaction', this.onCardBowed);
            expect(this.gameSpy.onTriggerWindow).toHaveBeenCalledWith('onCardBowed', 'reaction', this.onCardBowed);
        });
    });

    describe('unregisterAll()', function() {
        beforeEach(function() {
            this.events.register({ onRoundEnded: this.onRoundEnded });
            this.events.registerTriggerWindow('onCardBowed', 'reaction', this.onCardBowed);
        });

        it('should remove the listeners from the game', function() {
            this.events.unregisterAll();
            expect(this.gameSpy.off).toHaveBeenCalledWith('onRoundEnded', this.onRoundEnded);
            expect(this.gameSpy.offTriggerWindow).toHaveBeenCalledWith('onCardBowed', 'reaction', this.onCardBowed);
        });

        it('should not unregister multiple times', function() {
            this.events.unregisterAll();
            this.gameSpy.off.calls.reset();
            this.events.unregisterAll();
            expect(this.gameSpy.off.calls.count()).toBe(0);
        });
    });
});
