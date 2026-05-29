import { MenuPromptAction } from '../../../build/server/game/GameActions/MenuPromptAction.js';
import { Players } from '../../../build/server/game/Constants.js';
import { buildPlayerHarness, buildGameSpy, buildGameActionSpy, lastPromptArgs, lastPromptPlayer } from '../../../build/test/server/GameActions/_helpers.js';

describe('MenuPromptAction', function() {
    beforeEach(function() {
        this.game = buildGameSpy(['promptWithHandlerMenu']);
        ({ player: this.player, opponent: this.opponent } = buildPlayerHarness());
        this.context = { player: this.player, game: this.game };
        this.gameAction = buildGameActionSpy();
        this.choiceHandler = jasmine.createSpy('choiceHandler').and.callFake((choice) => ({ chosen: choice }));
        this.action = (overrides = {}) => new MenuPromptAction(Object.assign({
            activePromptTitle: 'pick',
            gameAction: this.gameAction,
            choices: ['a', 'b'],
            choiceHandler: this.choiceHandler
        }, overrides));
    });

    describe('addEventsToArray()', function() {
        it('should prompt the current player when player is Players.Self', function() {
            this.action({ player: Players.Self }).addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.player);
        });

        it('should prompt the opponent when player is Players.Opponent', function() {
            this.action({ player: Players.Opponent }).addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.opponent);
        });

        it('should skip prompting and the gameAction when player is Opponent and no opponent exists', function() {
            this.player.opponent = undefined;
            this.action({ player: Players.Opponent }).addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.gameAction.addEventsToArray).not.toHaveBeenCalled();
        });

        it('should default to the current player when player is unspecified', function() {
            this.action().addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.player);
        });

        it('should auto-resolve the only choice without prompting', function() {
            const events = [];
            this.action({ choices: ['only'] }).addEventsToArray(events, this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.choiceHandler).toHaveBeenCalledWith('only', true, jasmine.any(Object));
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(events, this.context, { chosen: 'only' });
        });

        it('should not invoke the gameAction when choices is empty', function() {
            this.action({ choices: [] }).addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.gameAction.addEventsToArray).not.toHaveBeenCalled();
        });

        it('should call a function-valued choices with the resolved properties bag', function() {
            const choicesFn = jasmine.createSpy('choicesFn').and.returnValue(['x', 'y']);
            this.action({ choices: choicesFn }).addEventsToArray([], this.context);
            expect(choicesFn).toHaveBeenCalledWith(jasmine.objectContaining({
                activePromptTitle: 'pick', gameAction: this.gameAction, choiceHandler: this.choiceHandler
            }));
        });

        it('should resolve a function-valued choices to a list and prompt with that list', function() {
            this.action({ choices: () => ['x', 'y'] }).addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).toHaveBeenCalled();
            expect(lastPromptArgs(this.game.promptWithHandlerMenu).choices).toEqual(['x', 'y']);
        });

        it('should forward the choice-handler-derived properties to the gameAction', function() {
            const events = [];
            this.choiceHandler.and.callFake((choice) => ({ kind: 'specific', value: choice.toUpperCase() }));
            this.action().addEventsToArray(events, this.context);
            lastPromptArgs(this.game.promptWithHandlerMenu).choiceHandler('a');
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(
                events, this.context, { kind: 'specific', value: 'A' }
            );
        });
    });

    describe('canAffect()', function() {
        it('should invoke the gameAction with each choice expanded via choiceHandler', function() {
            this.choiceHandler.and.callFake((choice) => ({ kind: choice }));
            this.gameAction.canAffect.and.returnValue(false);
            this.action().canAffect('target', this.context);
            const calls = this.gameAction.canAffect.calls.allArgs();
            expect(calls).toContain(['target', this.context, { kind: 'a' }]);
            expect(calls).toContain(['target', this.context, { kind: 'b' }]);
        });

        it('should short-circuit after the first affectable choice', function() {
            this.gameAction.canAffect.and.returnValues(true, true);
            this.action().canAffect('target', this.context);
            expect(this.gameAction.canAffect.calls.count()).toBe(1);
        });
    });

    describe('hasLegalTarget()', function() {
        it('should expand each choice through choiceHandler before delegating', function() {
            this.choiceHandler.and.callFake((choice) => ({ kind: choice }));
            this.gameAction.hasLegalTarget.and.returnValue(false);
            this.action().hasLegalTarget(this.context);
            const calls = this.gameAction.hasLegalTarget.calls.allArgs();
            expect(calls).toContain([this.context, { kind: 'a' }]);
            expect(calls).toContain([this.context, { kind: 'b' }]);
        });
    });

    describe('hasTargetsChosenByInitiatingPlayer()', function() {
        it('should delegate to the gameAction', function() {
            this.gameAction.hasTargetsChosenByInitiatingPlayer.and.returnValue('passed-through');
            const result = this.action().hasTargetsChosenByInitiatingPlayer(this.context);
            expect(this.gameAction.hasTargetsChosenByInitiatingPlayer).toHaveBeenCalledWith(this.context);
            expect(result).toBe('passed-through');
        });
    });

    describe('getEffectMessage()', function() {
        it('should return the default make-a-choice template with the target array', function() {
            const message = this.action({ target: 'tgt' }).getEffectMessage(this.context);
            expect(message).toEqual(['make a choice for {0}', [['tgt']]]);
        });
    });
});
