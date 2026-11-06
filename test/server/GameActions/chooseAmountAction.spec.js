import { ChooseAmountAction } from '../../../build/server/game/GameActions/ChooseAmountAction.js';
import { Players } from '../../../build/server/game/Constants.js';
import { buildPlayerHarness, buildGameSpy, buildGameActionSpy, lastPromptArgs, lastPromptPlayer } from '../../../build/test/server/GameActions/_helpers.js';

describe('ChooseAmountAction', function() {
    beforeEach(function() {
        this.game = buildGameSpy(['promptWithHandlerMenu', 'addMessage']);
        ({ player: this.player, opponent: this.opponent } = buildPlayerHarness());
        this.context = { player: this.player, game: this.game };
        this.actions = {};
        this.gameAction = jasmine.createSpy('gameAction').and.callFake((amount) => {
            this.actions[amount] ??= buildGameActionSpy();
            return this.actions[amount];
        });
        this.action = (overrides = {}) => new ChooseAmountAction(Object.assign({
            activePromptTitle: 'How many?',
            max: 3,
            gameAction: this.gameAction
        }, overrides));
    });

    describe('addEventsToArray()', function() {
        it('offers each amount from 1 to max to the player of the ability', function() {
            this.action().addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.player);
            expect(lastPromptArgs(this.game.promptWithHandlerMenu).choices).toEqual(['1', '2', '3']);
        });

        it('starts at min', function() {
            this.action({ min: 2 }).addEventsToArray([], this.context);
            expect(lastPromptArgs(this.game.promptWithHandlerMenu).choices).toEqual(['2', '3']);
        });

        it('lets the opponent or a given player choose', function() {
            this.action({ player: Players.Opponent }).addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.opponent);
            this.action({ player: this.opponent }).addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.opponent);
        });

        it('only offers amounts whose action has a legal target', function() {
            this.action().hasLegalTarget(this.context);
            this.actions[2].hasLegalTarget.and.returnValue(false);
            this.action().addEventsToArray([], this.context);
            expect(lastPromptArgs(this.game.promptWithHandlerMenu).choices).toEqual(['1', '3']);
        });

        it('resolves the chosen amount\'s action and prints its message', function() {
            const events = [];
            const message = jasmine.createSpy('message').and.returnValue(['chose']);
            this.action({ message }).addEventsToArray(events, this.context);
            lastPromptArgs(this.game.promptWithHandlerMenu).choiceHandler('2');
            expect(this.actions[2].addEventsToArray).toHaveBeenCalledWith(events, this.context, {});
            expect(this.actions[1].addEventsToArray).not.toHaveBeenCalled();
            expect(message).toHaveBeenCalledWith(this.context, 2, this.player, []);
            expect(this.game.addMessage).toHaveBeenCalledWith(['chose']);
        });

        it('resolves without a prompt when only one amount is possible', function() {
            const events = [];
            this.action({ max: 1 }).addEventsToArray(events, this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.actions[1].addEventsToArray).toHaveBeenCalledWith(events, this.context, {});
        });

        it('does nothing when max is below min', function() {
            this.action({ max: 0 }).addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.gameAction).not.toHaveBeenCalled();
        });

        it('passes its target to max, gameAction and the chosen action', function() {
            const max = jasmine.createSpy('max').and.returnValue(2);
            this.action({ max }).addEventsToArray([], this.context, { target: 'card' });
            expect(max).toHaveBeenCalledWith(['card']);
            expect(this.gameAction).toHaveBeenCalledWith(1, ['card']);
            lastPromptArgs(this.game.promptWithHandlerMenu).choiceHandler('1');
            expect(this.actions[1].addEventsToArray).toHaveBeenCalledWith([], this.context, { target: ['card'] });
        });
    });

    describe('hasLegalTarget()', function() {
        it('is legal when any amount\'s action is', function() {
            this.action().hasLegalTarget(this.context);
            this.actions[1].hasLegalTarget.and.returnValue(false);
            this.actions[2].hasLegalTarget.and.returnValue(false);
            expect(this.action().hasLegalTarget(this.context)).toBe(true);
            this.actions[3].hasLegalTarget.and.returnValue(false);
            expect(this.action().hasLegalTarget(this.context)).toBe(false);
        });
    });
});
