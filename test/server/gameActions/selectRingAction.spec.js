import { SelectRingAction } from '../../../build/server/game/GameActions/SelectRingActions.js';

describe('SelectRingAction', function() {
    beforeEach(function() {
        this.ringA = { element: 'fire', type: 'ring', isUnclaimed: () => true, checkRestrictions: () => true };
        this.ringB = { element: 'air', type: 'ring', isUnclaimed: () => true, checkRestrictions: () => true };
        this.rings = { fire: this.ringA, air: this.ringB };
        this.game = jasmine.createSpyObj('game', ['promptForRingSelect', 'addMessage']);
        this.game.rings = this.rings;
        this.opponent = { name: 'opp' };
        this.player = { name: 'self', opponent: this.opponent };
        this.context = { player: this.player, game: this.game, gameActionsResolutionChain: [], stage: 'effect' };
        this.gameAction = jasmine.createSpyObj('gameAction', [
            'hasLegalTarget', 'canAffect', 'addEventsToArray'
        ]);
        this.gameAction.hasLegalTarget.and.returnValue(true);
        this.gameAction.canAffect.and.returnValue(true);
    });

    describe('canAffect()', function() {
        it('should reject when player is Opponent but no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new SelectRingAction({ player: 'opponent', gameAction: this.gameAction });
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
            const action = new SelectRingAction({ player: 'opponent', gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForRingSelect.calls.mostRecent().args[0]).toBe(this.opponent);
        });

        it('should not prompt when player is Opponent and no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new SelectRingAction({ player: 'opponent', gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForRingSelect).not.toHaveBeenCalled();
        });

        it('should default to the current player when player is unspecified', function() {
            const action = new SelectRingAction({ gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForRingSelect.calls.mostRecent().args[0]).toBe(this.player);
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
            expect(this.game.promptForRingSelect.calls.mostRecent().args[0]).toBe(override);
        });

        it('should route the selected ring through gameAction.addEventsToArray with subActionProperties', function() {
            const events = [];
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((ring) => ({ target: ring, element: ring.element }));
            const action = new SelectRingAction({ gameAction: this.gameAction, subActionProperties });
            action.addEventsToArray(events, this.context);
            const onSelect = this.game.promptForRingSelect.calls.mostRecent().args[1].onSelect;
            onSelect(this.player, this.ringA);
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(
                events, this.context, jasmine.objectContaining({ element: 'fire' })
            );
        });

        it('should add a message via messageArgs when message is configured', function() {
            const messageArgs = jasmine.createSpy('messageArgs').and.returnValue(['arg1', 'arg2']);
            const action = new SelectRingAction({
                gameAction: this.gameAction, message: 'picked', messageArgs
            });
            action.addEventsToArray([], this.context);
            const onSelect = this.game.promptForRingSelect.calls.mostRecent().args[1].onSelect;
            onSelect(this.player, this.ringA);
            expect(this.game.addMessage).toHaveBeenCalledWith('picked', 'arg1', 'arg2');
        });

        it('should include a Cancel button when cancelHandler is provided', function() {
            const cancelHandler = jasmine.createSpy('cancelHandler');
            const action = new SelectRingAction({ gameAction: this.gameAction, cancelHandler });
            action.addEventsToArray([], this.context);
            const promptArgs = this.game.promptForRingSelect.calls.mostRecent().args[1];
            expect(promptArgs.buttons).toEqual([{ text: 'Cancel', arg: 'cancel' }]);
            expect(promptArgs.onCancel).toBe(cancelHandler);
        });
    });

    describe('hasTargetsChosenByInitiatingPlayer()', function() {
        it('should be true when targets flag is set and player is not opponent', function() {
            const action = new SelectRingAction({ targets: true, gameAction: this.gameAction });
            expect(action.hasTargetsChosenByInitiatingPlayer(this.context)).toBe(true);
        });

        it('should be false when player is opponent even with targets flag', function() {
            const action = new SelectRingAction({ targets: true, player: 'opponent', gameAction: this.gameAction });
            expect(action.hasTargetsChosenByInitiatingPlayer(this.context)).toBe(false);
        });

        it('should be false when targets flag is not set', function() {
            const action = new SelectRingAction({ gameAction: this.gameAction });
            expect(action.hasTargetsChosenByInitiatingPlayer(this.context)).toBe(false);
        });
    });
});
