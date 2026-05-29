import { SelectCardAction } from '../../../build/server/game/GameActions/SelectCardAction.js';

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
        this.game = jasmine.createSpyObj('game', ['promptForSelect', 'addMessage', 'openEventWindow']);
        this.opponent = { name: 'opp' };
        this.player = { name: 'self', opponent: this.opponent };
        this.context = { player: this.player, game: this.game, gameActionsResolutionChain: [] };
        this.gameAction = jasmine.createSpyObj('gameAction', [
            'setDefaultTarget', 'allTargetsLegal', 'hasLegalTarget', 'canAffect', 'addEventsToArray'
        ]);
        this.gameAction.allTargetsLegal.and.returnValue(true);
        this.gameAction.hasLegalTarget.and.returnValue(true);
        this.gameAction.canAffect.and.returnValue(true);
    });

    describe('getProperties()', function() {
        it('should install setDefaultTarget on the underlying gameAction', function() {
            const action = new SelectCardAction({ selector: this.selector, gameAction: this.gameAction });
            action.getProperties(this.context);
            expect(this.gameAction.setDefaultTarget).toHaveBeenCalled();
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
                player: 'opponent', selector: this.selector, gameAction: this.gameAction
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
                player: 'opponent', selector: this.selector, gameAction: this.gameAction
            });
            action.hasLegalTarget(this.context);
            expect(this.selector.hasEnoughTargets).toHaveBeenCalledWith(this.context, this.opponent);
        });
    });

    describe('addEventsToArray()', function() {
        it('should skip prompting when player is Opponent and no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new SelectCardAction({
                player: 'opponent', selector: this.selector, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForSelect).not.toHaveBeenCalled();
        });

        it('should prompt the opponent when player is Players.Opponent', function() {
            const action = new SelectCardAction({
                player: 'opponent', selector: this.selector, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForSelect.calls.mostRecent().args[0]).toBe(this.opponent);
        });

        it('should default to the current player when player is unspecified', function() {
            const action = new SelectCardAction({ selector: this.selector, gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(this.game.promptForSelect.calls.mostRecent().args[0]).toBe(this.player);
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
            const onSelect = this.game.promptForSelect.calls.mostRecent().args[1].onSelect;
            onSelect(this.player, this.cardA);
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
            const onSelect = this.game.promptForSelect.calls.mostRecent().args[1].onSelect;
            onSelect(this.player, this.cardA);
            expect(this.game.openEventWindow).toHaveBeenCalledWith(events);
        });

        it('should NOT open an event window when manuallyRaiseEvent is false', function() {
            const action = new SelectCardAction({
                selector: this.selector, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            const onSelect = this.game.promptForSelect.calls.mostRecent().args[1].onSelect;
            onSelect(this.player, this.cardA);
            expect(this.game.openEventWindow).not.toHaveBeenCalled();
        });

        it('should add a message via messageArgs when message is configured', function() {
            const messageArgs = jasmine.createSpy('messageArgs').and.returnValue(['arg1', 'arg2']);
            const action = new SelectCardAction({
                selector: this.selector, gameAction: this.gameAction,
                message: 'msg', messageArgs
            });
            action.addEventsToArray([], this.context);
            const onSelect = this.game.promptForSelect.calls.mostRecent().args[1].onSelect;
            onSelect(this.player, this.cardA);
            expect(this.game.addMessage).toHaveBeenCalledWith('msg', 'arg1', 'arg2');
        });
    });
});
