import { MenuPromptAction } from '../../../build/server/game/GameActions/MenuPromptAction.js';

describe('MenuPromptAction', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['promptWithHandlerMenu']);
        this.opponent = { name: 'opp' };
        this.player = { name: 'self', opponent: this.opponent };
        this.context = { player: this.player, game: this.game };
        this.gameAction = jasmine.createSpyObj('gameAction', [
            'canAffect', 'hasLegalTarget', 'addEventsToArray', 'hasTargetsChosenByInitiatingPlayer'
        ]);
        this.gameAction.canAffect.and.returnValue(true);
        this.gameAction.hasLegalTarget.and.returnValue(true);
        this.choiceHandler = jasmine.createSpy('choiceHandler').and.callFake((choice) => ({ chosen: choice }));
    });

    describe('addEventsToArray()', function() {
        it('should prompt the current player when player is Players.Self', function() {
            const action = new MenuPromptAction({
                activePromptTitle: 'pick', player: 'self',
                gameAction: this.gameAction, choices: ['a', 'b'], choiceHandler: this.choiceHandler
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu.calls.mostRecent().args[0]).toBe(this.player);
        });

        it('should prompt the opponent when player is Players.Opponent', function() {
            const action = new MenuPromptAction({
                activePromptTitle: 'pick', player: 'opponent',
                gameAction: this.gameAction, choices: ['a', 'b'], choiceHandler: this.choiceHandler
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu.calls.mostRecent().args[0]).toBe(this.opponent);
        });

        it('should skip the prompt entirely when player is Opponent and no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new MenuPromptAction({
                activePromptTitle: 'pick', player: 'opponent',
                gameAction: this.gameAction, choices: ['a', 'b'], choiceHandler: this.choiceHandler
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.gameAction.addEventsToArray).not.toHaveBeenCalled();
        });

        it('should default to the current player when player is unspecified', function() {
            const action = new MenuPromptAction({
                activePromptTitle: 'pick', gameAction: this.gameAction,
                choices: ['a', 'b'], choiceHandler: this.choiceHandler
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu.calls.mostRecent().args[0]).toBe(this.player);
        });

        it('should auto-resolve the only choice without prompting', function() {
            const events = [];
            const action = new MenuPromptAction({
                activePromptTitle: 'pick', gameAction: this.gameAction,
                choices: ['only'], choiceHandler: this.choiceHandler
            });
            action.addEventsToArray(events, this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.choiceHandler).toHaveBeenCalledWith('only', true, jasmine.any(Object));
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(events, this.context, { chosen: 'only' });
        });

        it('should not invoke the underlying gameAction when choices is empty', function() {
            const action = new MenuPromptAction({
                activePromptTitle: 'pick', gameAction: this.gameAction,
                choices: [], choiceHandler: this.choiceHandler
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.gameAction.addEventsToArray).not.toHaveBeenCalled();
        });

        it('should resolve a function-valued choices before counting them', function() {
            const action = new MenuPromptAction({
                activePromptTitle: 'pick', gameAction: this.gameAction,
                choices: () => ['x'], choiceHandler: this.choiceHandler
            });
            action.addEventsToArray([], this.context);
            // function returns ['x'] (length 1), so the auto-resolve branch fires
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.choiceHandler).toHaveBeenCalledWith('x', true, jasmine.any(Object));
        });

        it('should forward the choice-handler-derived properties to the gameAction', function() {
            const events = [];
            this.choiceHandler.and.callFake((choice) => ({ kind: 'specific', value: choice.toUpperCase() }));
            const action = new MenuPromptAction({
                activePromptTitle: 'pick', gameAction: this.gameAction,
                choices: ['a', 'b'], choiceHandler: this.choiceHandler
            });
            action.addEventsToArray(events, this.context);
            // Triggers the prompt; invoke the choiceHandler it was given
            const promptArgs = this.game.promptWithHandlerMenu.calls.mostRecent().args[1];
            promptArgs.choiceHandler('a');
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(
                events, this.context, { kind: 'specific', value: 'A' }
            );
        });
    });

    describe('canAffect()', function() {
        it('should invoke the underlying gameAction with each choice expanded via choiceHandler', function() {
            this.choiceHandler.and.callFake((choice) => ({ kind: choice }));
            const action = new MenuPromptAction({
                activePromptTitle: 'pick', gameAction: this.gameAction,
                choices: ['a', 'b'], choiceHandler: this.choiceHandler
            });
            action.canAffect('target', this.context);
            const calls = this.gameAction.canAffect.calls.allArgs();
            expect(calls).toContain(['target', this.context, { kind: 'a' }]);
        });

        it('should stop short-circuit on the first affectable choice', function() {
            this.gameAction.canAffect.and.returnValues(true, true);
            const action = new MenuPromptAction({
                activePromptTitle: 'pick', gameAction: this.gameAction,
                choices: ['a', 'b'], choiceHandler: this.choiceHandler
            });
            action.canAffect('target', this.context);
            expect(this.gameAction.canAffect.calls.count()).toBe(1);
        });
    });

    describe('hasLegalTarget()', function() {
        it('should expand each choice through choiceHandler before delegating', function() {
            this.choiceHandler.and.callFake((choice) => ({ kind: choice }));
            this.gameAction.hasLegalTarget.and.returnValue(false);
            const action = new MenuPromptAction({
                activePromptTitle: 'pick', gameAction: this.gameAction,
                choices: ['a', 'b'], choiceHandler: this.choiceHandler
            });
            action.hasLegalTarget(this.context);
            const calls = this.gameAction.hasLegalTarget.calls.allArgs();
            expect(calls).toContain([this.context, { kind: 'a' }]);
            expect(calls).toContain([this.context, { kind: 'b' }]);
        });
    });
});
