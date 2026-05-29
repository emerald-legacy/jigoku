import { CardMenuAction } from '../../../build/server/game/GameActions/CardMenuAction.js';

describe('CardMenuAction', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['promptWithHandlerMenu', 'addMessage']);
        this.opponent = { name: 'opp' };
        this.player = { name: 'self', opponent: this.opponent };
        this.context = { player: this.player, game: this.game };
        this.cardA = { name: 'A' };
        this.cardB = { name: 'B' };
        this.gameAction = jasmine.createSpyObj('gameAction', [
            'setDefaultTarget', 'canAffect', 'hasLegalTarget', 'addEventsToArray', 'hasTargetsChosenByInitiatingPlayer'
        ]);
        this.gameAction.canAffect.and.returnValue(true);
        this.gameAction.hasLegalTarget.and.returnValue(true);
    });

    describe('getProperties()', function() {
        it('should install setDefaultTarget on the underlying gameAction', function() {
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction
            });
            action.getProperties(this.context);
            expect(this.gameAction.setDefaultTarget).toHaveBeenCalled();
        });
    });

    describe('addEventsToArray()', function() {
        it('should prompt the opponent when player is Players.Opponent', function() {
            const action = new CardMenuAction({
                player: 'opponent', cards: [this.cardA, this.cardB], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu.calls.mostRecent().args[0]).toBe(this.opponent);
        });

        it('should skip prompting when player is Opponent and no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new CardMenuAction({
                player: 'opponent', cards: [this.cardA], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
        });

        it('should default to the current player when player is unspecified', function() {
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu.calls.mostRecent().args[0]).toBe(this.player);
        });

        it('should prompt the override player when targets is set and choosingPlayerOverride is provided', function() {
            const override = { name: 'override' };
            this.context.choosingPlayerOverride = override;
            const action = new CardMenuAction({
                targets: true, cards: [this.cardA], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu.calls.mostRecent().args[0]).toBe(override);
        });

        it('should not prompt when cards and choices are both empty', function() {
            const action = new CardMenuAction({
                cards: [], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
        });

        it('should not prompt when the gameAction has no legal target', function() {
            this.gameAction.hasLegalTarget.and.returnValue(false);
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
        });

        it('should route the picked card through the gameAction with subActionProperties', function() {
            const events = [];
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((card) => ({ target: card, extra: 'x' }));
            const action = new CardMenuAction({
                cards: [this.cardA, this.cardB], gameAction: this.gameAction, subActionProperties
            });
            action.addEventsToArray(events, this.context);
            const cardHandler = this.game.promptWithHandlerMenu.calls.mostRecent().args[1].cardHandler;
            cardHandler(this.cardA);
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(
                events, this.context, jasmine.objectContaining({ target: this.cardA, extra: 'x' })
            );
        });

        it('should add a message via messageArgs when message is configured', function() {
            const messageArgs = jasmine.createSpy('messageArgs').and.returnValue(['arg1', 'arg2']);
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction,
                message: 'picked {0}', messageArgs
            });
            action.addEventsToArray([], this.context);
            const cardHandler = this.game.promptWithHandlerMenu.calls.mostRecent().args[1].cardHandler;
            cardHandler(this.cardA);
            expect(messageArgs).toHaveBeenCalled();
            expect(this.game.addMessage).toHaveBeenCalledWith('picked {0}', 'arg1', 'arg2');
        });

        it('should not add a message when message is not configured', function() {
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            const cardHandler = this.game.promptWithHandlerMenu.calls.mostRecent().args[1].cardHandler;
            cardHandler(this.cardA);
            expect(this.game.addMessage).not.toHaveBeenCalled();
        });
    });

    describe('hasLegalTarget()', function() {
        it('should short-circuit to true when handlers are present', function() {
            const action = new CardMenuAction({
                cards: [], handlers: [() => {}], gameAction: this.gameAction
            });
            expect(action.hasLegalTarget(this.context)).toBe(true);
            expect(this.gameAction.hasLegalTarget).not.toHaveBeenCalled();
        });

        it('should delegate entirely to gameActionHasLegalTarget when provided', function() {
            const override = jasmine.createSpy('override').and.returnValue('overridden');
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction, gameActionHasLegalTarget: override
            });
            const result = action.hasLegalTarget(this.context);
            expect(override).toHaveBeenCalledWith(this.context);
            expect(this.gameAction.hasLegalTarget).not.toHaveBeenCalled();
            expect(result).toBe('overridden');
        });

        it('should ask the gameAction about each card via subActionProperties', function() {
            this.gameAction.hasLegalTarget.and.returnValue(false);
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((card) => ({ target: card }));
            const action = new CardMenuAction({
                cards: [this.cardA, this.cardB], gameAction: this.gameAction, subActionProperties
            });
            action.hasLegalTarget(this.context);
            const calls = this.gameAction.hasLegalTarget.calls.allArgs();
            expect(calls.some((args) => args[1].target === this.cardA)).toBe(true);
            expect(calls.some((args) => args[1].target === this.cardB)).toBe(true);
        });
    });

    describe('canAffect()', function() {
        it('should expand each card through subActionProperties before asking the gameAction', function() {
            this.gameAction.canAffect.and.returnValue(false);
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((card) => ({ target: card, tag: card.name }));
            const action = new CardMenuAction({
                cards: [this.cardA, this.cardB], gameAction: this.gameAction, subActionProperties
            });
            action.canAffect('outerTarget', this.context);
            const calls = this.gameAction.canAffect.calls.allArgs();
            expect(calls.some((args) => args[0] === 'outerTarget' && args[2].tag === 'A')).toBe(true);
            expect(calls.some((args) => args[0] === 'outerTarget' && args[2].tag === 'B')).toBe(true);
        });
    });

    describe('hasTargetsChosenByInitiatingPlayer()', function() {
        it('should return true when targets flag is set, without consulting the gameAction', function() {
            const action = new CardMenuAction({
                targets: true, cards: [this.cardA], gameAction: this.gameAction
            });
            expect(action.hasTargetsChosenByInitiatingPlayer(this.context)).toBe(true);
            expect(this.gameAction.hasTargetsChosenByInitiatingPlayer).not.toHaveBeenCalled();
        });

        it('should consult the gameAction when targets flag is not set', function() {
            this.gameAction.hasTargetsChosenByInitiatingPlayer.and.returnValue('whatever');
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction
            });
            action.hasTargetsChosenByInitiatingPlayer(this.context);
            expect(this.gameAction.hasTargetsChosenByInitiatingPlayer).toHaveBeenCalled();
        });
    });
});
