import { SelectRingAction } from '../../../build/server/game/GameActions/SelectRingActions.js';
import { Players } from '../../../build/server/game/Constants.js';
import { buildPlayerHarness, buildGameSpy, buildGameActionSpy, lastPromptArgs, lastPromptPlayer } from '../../../build/test/server/GameActions/_helpers.js';

describe('SelectRingAction', function() {
    beforeEach(function() {
        this.ringA = { element: 'fire', type: 'ring', isUnclaimed: () => true, checkRestrictions: () => true };
        this.ringB = { element: 'air', type: 'ring', isUnclaimed: () => true, checkRestrictions: () => true };
        this.rings = { fire: this.ringA, air: this.ringB };
        this.game = buildGameSpy(['promptForRingSelect', 'addMessage']);
        this.game.rings = this.rings;
        ({ player: this.player, opponent: this.opponent } = buildPlayerHarness());
        this.context = { player: this.player, game: this.game, gameActionsResolutionChain: [], stage: 'effect' };
        this.gameAction = buildGameActionSpy();
    });

    describe('canAffect()', function() {
        it('should reject when player is Opponent and no opponent exists, without consulting gameAction', function() {
            this.player.opponent = undefined;
            const action = new SelectRingAction({ player: Players.Opponent, gameAction: this.gameAction });
            expect(action.canAffect(this.ringA, this.context)).toBe(false);
            expect(this.gameAction.hasLegalTarget).not.toHaveBeenCalled();
        });

        it('should reject when ringCondition rejects the ring, without consulting gameAction', function() {
            const action = new SelectRingAction({ ringCondition: () => false, gameAction: this.gameAction });
            expect(action.canAffect(this.ringA, this.context)).toBe(false);
            expect(this.gameAction.hasLegalTarget).not.toHaveBeenCalled();
        });

        it('should ask the gameAction with subActionProperties when the ring passes the condition', function() {
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((ring) => ({ target: ring, tag: ring.element }));
            const action = new SelectRingAction({ gameAction: this.gameAction, subActionProperties });
            action.canAffect(this.ringA, this.context);
            expect(this.gameAction.hasLegalTarget).toHaveBeenCalledWith(this.context, jasmine.objectContaining({ tag: 'fire' }));
        });
    });

    describe('hasLegalTarget()', function() {
        it('should iterate every ring on the game until one is affectable', function() {
            this.gameAction.hasLegalTarget.and.returnValues(false, true);
            const action = new SelectRingAction({ gameAction: this.gameAction });
            const result = action.hasLegalTarget(this.context);
            expect(result).toBe(true);
            expect(this.gameAction.hasLegalTarget.calls.count()).toBe(2);
        });

        it('should consult every ring when none is affectable', function() {
            this.gameAction.hasLegalTarget.and.returnValue(false);
            const action = new SelectRingAction({ gameAction: this.gameAction });
            const result = action.hasLegalTarget(this.context);
            expect(result).toBe(false);
            expect(this.gameAction.hasLegalTarget.calls.count()).toBe(2);
        });
    });

    describe('addEventsToArray()', function() {
        it('should prompt the opponent when player is Players.Opponent', function() {
            const action = new SelectRingAction({ player: Players.Opponent, gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptForRingSelect)).toBe(this.opponent);
        });

        it('should not prompt when player is Opponent and no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new SelectRingAction({ player: Players.Opponent, gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForRingSelect).not.toHaveBeenCalled();
        });

        it('should default to the current player when player is unspecified', function() {
            const action = new SelectRingAction({ gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptForRingSelect)).toBe(this.player);
        });

        it('should not prompt when no ring satisfies ringCondition', function() {
            const action = new SelectRingAction({ ringCondition: () => false, gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForRingSelect).not.toHaveBeenCalled();
        });

        it('should not prompt when no ring is affectable by the gameAction', function() {
            this.gameAction.hasLegalTarget.and.returnValue(false);
            const action = new SelectRingAction({ gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForRingSelect).not.toHaveBeenCalled();
        });

        it('should prompt the override player when targets is set and choosingPlayerOverride is provided', function() {
            const override = { name: 'override' };
            this.context.choosingPlayerOverride = override;
            const action = new SelectRingAction({ targets: true, gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptForRingSelect)).toBe(override);
        });

        it('should route the selected ring through gameAction.addEventsToArray with subActionProperties', function() {
            const events = [];
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((ring) => ({ target: ring, element: ring.element }));
            const action = new SelectRingAction({ gameAction: this.gameAction, subActionProperties });
            action.addEventsToArray(events, this.context);
            lastPromptArgs(this.game.promptForRingSelect).onSelect(this.player, this.ringA);
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(
                events, this.context, jasmine.objectContaining({ element: 'fire' })
            );
        });

        it('should AND-compose user ringCondition with gameAction.hasLegalTarget in the wrapped predicate', function() {
            const userCondition = jasmine.createSpy('userCondition').and.returnValue(true);
            const subActionProperties = (ring) => ({ target: ring, element: ring.element });
            const action = new SelectRingAction({ gameAction: this.gameAction, ringCondition: userCondition, subActionProperties });
            action.addEventsToArray([], this.context);
            const wrapped = lastPromptArgs(this.game.promptForRingSelect).ringCondition;

            userCondition.and.returnValue(true);
            this.gameAction.hasLegalTarget.and.returnValue(true);
            expect(wrapped(this.ringA, this.context)).toBeTruthy();

            userCondition.and.returnValue(false);
            this.gameAction.hasLegalTarget.and.returnValue(true);
            expect(wrapped(this.ringA, this.context)).toBeFalsy();

            userCondition.and.returnValue(true);
            this.gameAction.hasLegalTarget.and.returnValue(false);
            expect(wrapped(this.ringA, this.context)).toBeFalsy();
        });

        it('should call gameAction.hasLegalTarget with subActionProperties of the ring inside the wrapped predicate', function() {
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((ring) => ({ target: ring, element: ring.element }));
            const action = new SelectRingAction({ gameAction: this.gameAction, subActionProperties });
            action.addEventsToArray([], this.context);
            const wrapped = lastPromptArgs(this.game.promptForRingSelect).ringCondition;
            this.gameAction.hasLegalTarget.calls.reset();
            wrapped(this.ringA, this.context);
            expect(this.gameAction.hasLegalTarget).toHaveBeenCalledWith(this.context, jasmine.objectContaining({ element: 'fire' }));
        });

        it('should invoke messageArgs with (ring, selectingPlayer) and forward to addMessage', function() {
            const messageArgs = jasmine.createSpy('messageArgs').and.returnValue(['arg1', 'arg2']);
            const action = new SelectRingAction({
                gameAction: this.gameAction, message: 'picked', messageArgs
            });
            action.addEventsToArray([], this.context);
            lastPromptArgs(this.game.promptForRingSelect).onSelect(this.player, this.ringA);
            expect(messageArgs).toHaveBeenCalledWith(this.ringA, this.player);
            expect(this.game.addMessage).toHaveBeenCalledWith('picked', 'arg1', 'arg2');
        });

        it('should include a Cancel button when cancelHandler is provided', function() {
            const cancelHandler = jasmine.createSpy('cancelHandler');
            const action = new SelectRingAction({ gameAction: this.gameAction, cancelHandler });
            action.addEventsToArray([], this.context);
            const promptArgs = lastPromptArgs(this.game.promptForRingSelect);
            expect(promptArgs.buttons).toEqual([{ text: 'Cancel', arg: 'cancel' }]);
            expect(promptArgs.onCancel).toBe(cancelHandler);
        });

        it('should omit the Cancel button when cancelHandler is not provided', function() {
            const action = new SelectRingAction({ gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(lastPromptArgs(this.game.promptForRingSelect).buttons).toEqual([]);
        });
    });

    describe('hasTargetsChosenByInitiatingPlayer()', function() {
        it('should be true when targets flag is set and player is not opponent', function() {
            const action = new SelectRingAction({ targets: true, gameAction: this.gameAction });
            expect(action.hasTargetsChosenByInitiatingPlayer(this.context)).toBe(true);
        });

        it('should be false when player is opponent even with targets flag', function() {
            const action = new SelectRingAction({ targets: true, player: Players.Opponent, gameAction: this.gameAction });
            expect(action.hasTargetsChosenByInitiatingPlayer(this.context)).toBe(false);
        });

        it('should be false when targets flag is not set', function() {
            const action = new SelectRingAction({ gameAction: this.gameAction });
            expect(action.hasTargetsChosenByInitiatingPlayer(this.context)).toBe(false);
        });
    });

    describe('getEffectMessage()', function() {
        it('should return the default choose-a-ring-for template', function() {
            const action = new SelectRingAction({ target: 'tgt', gameAction: this.gameAction });
            expect(action.getEffectMessage(this.context)).toEqual(['choose a ring for {0}', [['tgt']]]);
        });
    });
});
