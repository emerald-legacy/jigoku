import { SelectCardAction } from '../../../build/server/game/GameActions/SelectCardAction.js';
import { Players } from '../../../build/server/game/Constants.js';
import { buildPlayerHarness, buildGameSpy, buildGameActionSpy, lastPromptArgs, lastPromptPlayer } from '../../../build/test/server/GameActions/_helpers.js';

describe('SelectCardAction', function() {
    beforeEach(function() {
        this.cardA = { name: 'A', getEffects: () => [] };
        this.cardB = { name: 'B', getEffects: () => [] };
        this.selector = jasmine.createSpyObj('selector', [
            'canTarget', 'hasEnoughTargets', 'getAllLegalTargets'
        ]);
        this.selector.canTarget.and.returnValue(true);
        this.selector.hasEnoughTargets.and.returnValue(true);
        this.selector.getAllLegalTargets.and.returnValue([this.cardA, this.cardB]);
        this.game = buildGameSpy(['promptForSelect', 'addMessage', 'openEventWindow']);
        ({ player: this.player, opponent: this.opponent } = buildPlayerHarness());
        this.context = { player: this.player, game: this.game, gameActionsResolutionChain: [] };
        this.gameAction = buildGameActionSpy();
    });

    describe('getProperties()', function() {
        it('should install a setDefaultTarget closure that returns the wrapped target', function() {
            const action = new SelectCardAction({
                target: 'tgt', selector: this.selector, gameAction: this.gameAction
            });
            action.getProperties(this.context);
            const installedFn = this.gameAction.setDefaultTarget.calls.mostRecent().args[0];
            expect(installedFn()).toEqual(['tgt']);
        });
    });

    describe('canAffect()', function() {
        it('should ask the selector with the current player by default', function() {
            const action = new SelectCardAction({ selector: this.selector, gameAction: this.gameAction });
            action.canAffect(this.cardA, this.context);
            expect(this.selector.canTarget).toHaveBeenCalledWith(this.cardA, this.context, this.player);
        });

        it('should ask the selector with the opponent when player is Players.Opponent', function() {
            const action = new SelectCardAction({
                player: Players.Opponent, selector: this.selector, gameAction: this.gameAction
            });
            action.canAffect(this.cardA, this.context);
            expect(this.selector.canTarget).toHaveBeenCalledWith(this.cardA, this.context, this.opponent);
        });

        it('should ask the selector with the override when targets flag and choosingPlayerOverride are set', function() {
            const override = { name: 'override' };
            this.context.choosingPlayerOverride = override;
            const action = new SelectCardAction({
                targets: true, selector: this.selector, gameAction: this.gameAction
            });
            action.canAffect(this.cardA, this.context);
            expect(this.selector.canTarget).toHaveBeenCalledWith(this.cardA, this.context, override);
        });
    });

    describe('hasLegalTarget()', function() {
        it('should ask the selector for enoughTargets with the current player by default', function() {
            const action = new SelectCardAction({ selector: this.selector, gameAction: this.gameAction });
            action.hasLegalTarget(this.context);
            expect(this.selector.hasEnoughTargets).toHaveBeenCalledWith(this.context, this.player);
        });

        it('should ask the selector with the opponent when player is Players.Opponent', function() {
            const action = new SelectCardAction({
                player: Players.Opponent, selector: this.selector, gameAction: this.gameAction
            });
            action.hasLegalTarget(this.context);
            expect(this.selector.hasEnoughTargets).toHaveBeenCalledWith(this.context, this.opponent);
        });
    });

    describe('addEventsToArray()', function() {
        it('should skip prompting when player is Opponent and no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new SelectCardAction({
                player: Players.Opponent, selector: this.selector, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForSelect).not.toHaveBeenCalled();
        });

        it('should prompt the opponent when player is Players.Opponent', function() {
            const action = new SelectCardAction({
                player: Players.Opponent, selector: this.selector, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptForSelect)).toBe(this.opponent);
        });

        it('should default to the current player when player is unspecified', function() {
            const action = new SelectCardAction({ selector: this.selector, gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptForSelect)).toBe(this.player);
        });

        it('should not prompt when selector reports no legal targets', function() {
            this.selector.hasEnoughTargets.and.returnValue(false);
            const action = new SelectCardAction({ selector: this.selector, gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForSelect).not.toHaveBeenCalled();
        });

        it('should auto-resolve when hidePromptIfSingleCard is set and exactly one target is legal', function() {
            const events = [];
            this.selector.getAllLegalTargets.and.returnValue([this.cardA]);
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((card) => ({ target: card, name: card.name }));
            const action = new SelectCardAction({
                selector: this.selector, gameAction: this.gameAction,
                hidePromptIfSingleCard: true, subActionProperties
            });
            action.addEventsToArray(events, this.context);
            expect(this.game.promptForSelect).not.toHaveBeenCalled();
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(
                events, this.context, jasmine.objectContaining({ name: 'A' })
            );
        });

        it('should prompt when hidePromptIfSingleCard is set but multiple targets are legal', function() {
            this.selector.getAllLegalTargets.and.returnValue([this.cardA, this.cardB]);
            const action = new SelectCardAction({
                selector: this.selector, gameAction: this.gameAction, hidePromptIfSingleCard: true
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForSelect).toHaveBeenCalled();
        });

        it('should route the selected card through the gameAction via subActionProperties on onSelect', function() {
            const events = [];
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((card) => ({ target: card, name: card.name }));
            const action = new SelectCardAction({
                selector: this.selector, gameAction: this.gameAction, subActionProperties
            });
            action.addEventsToArray(events, this.context);
            lastPromptArgs(this.game.promptForSelect).onSelect(this.player, this.cardA);
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(
                events, this.context, jasmine.objectContaining({ name: 'A', parentAction: action })
            );
        });

        it('should manually open an event window when manuallyRaiseEvent is set', function() {
            const events = [];
            const action = new SelectCardAction({
                selector: this.selector, gameAction: this.gameAction, manuallyRaiseEvent: true
            });
            action.addEventsToArray(events, this.context);
            lastPromptArgs(this.game.promptForSelect).onSelect(this.player, this.cardA);
            expect(this.game.openEventWindow).toHaveBeenCalledWith(events);
        });

        it('should NOT open an event window when manuallyRaiseEvent is false', function() {
            const action = new SelectCardAction({
                selector: this.selector, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            lastPromptArgs(this.game.promptForSelect).onSelect(this.player, this.cardA);
            expect(this.game.openEventWindow).not.toHaveBeenCalled();
        });

        it('should add a message via messageArgs when message is configured', function() {
            const messageArgs = jasmine.createSpy('messageArgs').and.returnValue(['arg1', 'arg2']);
            const action = new SelectCardAction({
                selector: this.selector, gameAction: this.gameAction,
                message: 'msg', messageArgs
            });
            action.addEventsToArray([], this.context);
            lastPromptArgs(this.game.promptForSelect).onSelect(this.player, this.cardA);
            expect(messageArgs).toHaveBeenCalledWith(this.cardA, this.player, jasmine.any(Object));
            expect(this.game.addMessage).toHaveBeenCalledWith('msg', 'arg1', 'arg2');
        });

        it('should include a Cancel button when cancelHandler is provided', function() {
            const cancelHandler = jasmine.createSpy('cancelHandler');
            const action = new SelectCardAction({
                selector: this.selector, gameAction: this.gameAction, cancelHandler
            });
            action.addEventsToArray([], this.context);
            const promptArgs = lastPromptArgs(this.game.promptForSelect);
            expect(promptArgs.buttons).toEqual([{ text: 'Cancel', arg: 'cancel' }]);
            expect(promptArgs.onCancel).toBe(cancelHandler);
        });

        it('should omit the Cancel button when cancelHandler is not provided', function() {
            const action = new SelectCardAction({
                selector: this.selector, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(lastPromptArgs(this.game.promptForSelect).buttons).toEqual([]);
        });

        describe('mustSelect via MustBeChosen effect', function() {
            it('should populate mustSelect with cards whose MustBeChosen effect matches target', function() {
                const matching = { isMatch: jasmine.createSpy('isMatch').and.returnValue(true) };
                const nonMatching = { isMatch: jasmine.createSpy('isMatch').and.returnValue(false) };
                this.cardA.getEffects = jasmine.createSpy('getEffectsA').and.returnValue([matching]);
                this.cardB.getEffects = jasmine.createSpy('getEffectsB').and.returnValue([nonMatching]);
                this.selector.getAllLegalTargets.and.returnValue([this.cardA, this.cardB]);
                const action = new SelectCardAction({
                    targets: true, selector: this.selector, gameAction: this.gameAction
                });
                action.addEventsToArray([], this.context);
                expect(lastPromptArgs(this.game.promptForSelect).mustSelect).toEqual([this.cardA]);
                expect(matching.isMatch).toHaveBeenCalledWith('target', this.context);
            });

            it('should produce an empty mustSelect when targets flag is unset', function() {
                const matching = { isMatch: jasmine.createSpy('isMatch').and.returnValue(true) };
                this.cardA.getEffects = jasmine.createSpy('getEffectsA').and.returnValue([matching]);
                const action = new SelectCardAction({
                    selector: this.selector, gameAction: this.gameAction
                });
                action.addEventsToArray([], this.context);
                expect(lastPromptArgs(this.game.promptForSelect).mustSelect).toEqual([]);
                expect(matching.isMatch).not.toHaveBeenCalled();
            });

            it('should produce an empty mustSelect when no card has a matching MustBeChosen effect', function() {
                const nonMatching = { isMatch: jasmine.createSpy('isMatch').and.returnValue(false) };
                this.cardA.getEffects = jasmine.createSpy('getEffectsA').and.returnValue([nonMatching]);
                this.cardB.getEffects = jasmine.createSpy('getEffectsB').and.returnValue([]);
                const action = new SelectCardAction({
                    targets: true, selector: this.selector, gameAction: this.gameAction
                });
                action.addEventsToArray([], this.context);
                expect(lastPromptArgs(this.game.promptForSelect).mustSelect).toEqual([]);
            });
        });
    });

    describe('hasTargetsChosenByInitiatingPlayer()', function() {
        it('should not throw when targets flag is set', function() {
            const action = new SelectCardAction({
                targets: true, selector: this.selector, gameAction: this.gameAction
            });
            expect(() => action.hasTargetsChosenByInitiatingPlayer(this.context)).not.toThrow();
        });
    });

    describe('getEffectMessage()', function() {
        it('should return the default choose-a-target-for template', function() {
            const action = new SelectCardAction({
                target: 'tgt', selector: this.selector, gameAction: this.gameAction
            });
            expect(action.getEffectMessage(this.context)).toEqual(['choose a target for {0}', [['tgt']]]);
        });

        it('should return the custom effect with effectArgs when configured', function() {
            const effectArgs = jasmine.createSpy('effectArgs').and.returnValue(['x']);
            const action = new SelectCardAction({
                target: 'tgt', selector: this.selector, gameAction: this.gameAction,
                effect: 'custom', effectArgs
            });
            expect(action.getEffectMessage(this.context)).toEqual(['custom', ['x']]);
        });
    });
});
