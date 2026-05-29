import { ChooseGameAction } from '../../../build/server/game/GameActions/ChooseGameAction.js';
import { Players } from '../../../build/server/game/Constants.js';
import { buildPlayerHarness, buildGameSpy, buildGameActionSpy, lastPromptArgs, lastPromptPlayer } from '../../../build/test/server/GameActions/_helpers.js';

describe('ChooseGameAction', function() {
    beforeEach(function() {
        this.game = buildGameSpy(['promptWithHandlerMenu', 'addMessage', 'queueSimpleStep']);
        ({ player: this.player, opponent: this.opponent } = buildPlayerHarness());
        this.context = { player: this.player, game: this.game };
        this.actionA = buildGameActionSpy();
        this.actionB = buildGameActionSpy();
    });

    describe('getProperties()', function() {
        it('should install a setDefaultTarget closure that returns the wrapped target', function() {
            const action = new ChooseGameAction({
                target: 'tgt',
                options: { A: { action: this.actionA } }
            });
            action.getProperties(this.context);
            const installedFn = this.actionA.setDefaultTarget.calls.mostRecent().args[0];
            expect(installedFn()).toEqual(['tgt']);
        });

        it('should install setDefaultTarget on every option action', function() {
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA }, B: { action: this.actionB } }
            });
            action.getProperties(this.context);
            expect(this.actionA.setDefaultTarget).toHaveBeenCalled();
            expect(this.actionB.setDefaultTarget).toHaveBeenCalled();
        });
    });

    describe('addEventsToArray()', function() {
        it('should prompt the opponent when player is Players.Opponent', function() {
            const action = new ChooseGameAction({
                player: Players.Opponent,
                options: { A: { action: this.actionA } }
            });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.opponent);
        });

        it('should fall back to current player when player is Opponent but no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new ChooseGameAction({
                player: Players.Opponent,
                options: { A: { action: this.actionA } }
            });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.player);
        });

        it('should default to the current player when player is unspecified', function() {
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA } }
            });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.player);
        });

        it('should not prompt when no option has a legal target', function() {
            this.actionA.hasLegalTarget.and.returnValue(false);
            this.actionB.hasLegalTarget.and.returnValue(false);
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA }, B: { action: this.actionB } }
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
        });

        it('should only offer choices whose action has a legal target', function() {
            this.actionA.hasLegalTarget.and.returnValue(true);
            this.actionB.hasLegalTarget.and.returnValue(false);
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA }, B: { action: this.actionB } }
            });
            action.addEventsToArray([], this.context);
            expect(lastPromptArgs(this.game.promptWithHandlerMenu).choices).toEqual(['A']);
        });

        it('should route the chosen action through addEventsToArray when the choice handler fires', function() {
            const events = [];
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA }, B: { action: this.actionB } }
            });
            action.addEventsToArray(events, this.context);
            lastPromptArgs(this.game.promptWithHandlerMenu).choiceHandler('B');
            const step = this.game.queueSimpleStep.calls.mostRecent().args[0];
            step();
            expect(this.actionB.addEventsToArray).toHaveBeenCalledWith(events, this.context);
            expect(this.actionA.addEventsToArray).not.toHaveBeenCalled();
        });

        it('should add the per-choice message when one is configured', function() {
            const action = new ChooseGameAction({
                target: 'tgt',
                options: { A: { action: this.actionA, message: 'msg' } }
            });
            action.addEventsToArray([], this.context);
            lastPromptArgs(this.game.promptWithHandlerMenu).choiceHandler('A');
            expect(this.game.addMessage).toHaveBeenCalledWith('msg', this.player, ['tgt']);
        });

        it('should append messageArgs to the per-choice message', function() {
            const action = new ChooseGameAction({
                target: 'tgt',
                messageArgs: ['extra1', 'extra2'],
                options: { A: { action: this.actionA, message: 'msg' } }
            });
            action.addEventsToArray([], this.context);
            lastPromptArgs(this.game.promptWithHandlerMenu).choiceHandler('A');
            expect(this.game.addMessage).toHaveBeenCalledWith('msg', this.player, ['tgt'], 'extra1', 'extra2');
        });

        it('should not add a message when the chosen option has none', function() {
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA } }
            });
            action.addEventsToArray([], this.context);
            lastPromptArgs(this.game.promptWithHandlerMenu).choiceHandler('A');
            expect(this.game.addMessage).not.toHaveBeenCalled();
        });
    });

    describe('hasLegalTarget()', function() {
        it('should iterate every option until one reports a legal target', function() {
            this.actionA.hasLegalTarget.and.returnValue(false);
            this.actionB.hasLegalTarget.and.returnValue(true);
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA }, B: { action: this.actionB } }
            });
            const result = action.hasLegalTarget(this.context);
            expect(result).toBe(true);
            expect(this.actionA.hasLegalTarget).toHaveBeenCalled();
            expect(this.actionB.hasLegalTarget).toHaveBeenCalled();
        });

        it('should consult every option when none reports a legal target', function() {
            this.actionA.hasLegalTarget.and.returnValue(false);
            this.actionB.hasLegalTarget.and.returnValue(false);
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA }, B: { action: this.actionB } }
            });
            const result = action.hasLegalTarget(this.context);
            expect(result).toBe(false);
            expect(this.actionA.hasLegalTarget.calls.count()).toBeGreaterThan(0);
            expect(this.actionB.hasLegalTarget.calls.count()).toBeGreaterThan(0);
        });
    });

    describe('canAffect()', function() {
        it('should ask each option action whether it can affect the target', function() {
            this.actionA.canAffect.and.returnValue(false);
            this.actionB.canAffect.and.returnValue(false);
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA }, B: { action: this.actionB } }
            });
            action.canAffect('target', this.context);
            expect(this.actionA.canAffect).toHaveBeenCalledWith('target', this.context);
            expect(this.actionB.canAffect).toHaveBeenCalledWith('target', this.context);
        });

        it('should short-circuit on the first affectable option', function() {
            this.actionA.canAffect.and.returnValue(true);
            this.actionB.canAffect.and.returnValue(true);
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA }, B: { action: this.actionB } }
            });
            action.canAffect('target', this.context);
            expect(this.actionA.canAffect.calls.count()).toBe(1);
            expect(this.actionB.canAffect).not.toHaveBeenCalled();
        });
    });

    describe('hasTargetsChosenByInitiatingPlayer()', function() {
        it('should iterate options until one requires the initiating player to choose', function() {
            this.actionA.hasTargetsChosenByInitiatingPlayer.and.returnValue(false);
            this.actionB.hasTargetsChosenByInitiatingPlayer.and.returnValue(true);
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA }, B: { action: this.actionB } }
            });
            expect(action.hasTargetsChosenByInitiatingPlayer(this.context)).toBe(true);
        });
    });
});
