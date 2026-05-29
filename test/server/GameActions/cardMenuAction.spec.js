import { CardMenuAction } from '../../../build/server/game/GameActions/CardMenuAction.js';
import { Players } from '../../../build/server/game/Constants.js';
import { buildPlayerHarness, buildGameSpy, buildGameActionSpy, lastPromptArgs, lastPromptPlayer } from '../../../build/test/server/GameActions/_helpers.js';

describe('CardMenuAction', function() {
    beforeEach(function() {
        this.game = buildGameSpy(['promptWithHandlerMenu', 'addMessage']);
        ({ player: this.player, opponent: this.opponent } = buildPlayerHarness());
        this.context = { player: this.player, game: this.game };
        this.cardA = { name: 'A' };
        this.cardB = { name: 'B' };
        this.gameAction = buildGameActionSpy();
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
                player: Players.Opponent, cards: [this.cardA, this.cardB], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.opponent);
        });

        it('should skip prompting when player is Opponent and no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new CardMenuAction({
                player: Players.Opponent, cards: [this.cardA], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
        });

        it('should default to the current player when player is unspecified', function() {
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.player);
        });

        it('should prompt the override player when targets is set and choosingPlayerOverride is provided', function() {
            const override = { name: 'override' };
            this.context.choosingPlayerOverride = override;
            const action = new CardMenuAction({
                targets: true, cards: [this.cardA], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(override);
        });

        it('should not prompt when cards and choices are both empty', function() {
            const action = new CardMenuAction({
                cards: [], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
        });

        it('should prompt when cards is empty but choices is non-empty (handlers provide legal target)', function() {
            const action = new CardMenuAction({
                cards: [], choices: ['x'], handlers: [() => {}], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).toHaveBeenCalled();
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
            lastPromptArgs(this.game.promptWithHandlerMenu).cardHandler(this.cardA);
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(
                events, this.context, jasmine.objectContaining({ target: this.cardA, extra: 'x' })
            );
        });

        it('should AND-compose gameAction.hasLegalTarget with user cardCondition in the wrapped predicate', function() {
            const userCondition = jasmine.createSpy('userCondition').and.returnValue(true);
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction, cardCondition: userCondition
            });
            action.addEventsToArray([], this.context);
            const wrapped = lastPromptArgs(this.game.promptWithHandlerMenu).cardCondition;

            userCondition.and.returnValue(true);
            this.gameAction.hasLegalTarget.and.returnValue(true);
            expect(wrapped(this.cardA, this.context)).toBeTruthy();

            userCondition.and.returnValue(false);
            this.gameAction.hasLegalTarget.and.returnValue(true);
            expect(wrapped(this.cardA, this.context)).toBeFalsy();

            userCondition.and.returnValue(true);
            this.gameAction.hasLegalTarget.and.returnValue(false);
            expect(wrapped(this.cardA, this.context)).toBeFalsy();
        });

        it('should call gameAction.hasLegalTarget with subActionProperties of the card inside the wrapped predicate', function() {
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((card) => ({ target: card, name: card.name }));
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction, subActionProperties
            });
            action.addEventsToArray([], this.context);
            const wrapped = lastPromptArgs(this.game.promptWithHandlerMenu).cardCondition;
            this.gameAction.hasLegalTarget.calls.reset();
            wrapped(this.cardA, this.context);
            expect(this.gameAction.hasLegalTarget).toHaveBeenCalledWith(this.context, jasmine.objectContaining({ name: 'A' }));
        });

        it('should invoke messageArgs with (chosenCard, player, filteredCards)', function() {
            const messageArgs = jasmine.createSpy('messageArgs').and.returnValue(['arg1', 'arg2']);
            const cardCondition = (card) => card === this.cardA;
            const action = new CardMenuAction({
                cards: [this.cardA, this.cardB], gameAction: this.gameAction,
                cardCondition,
                message: 'picked {0}', messageArgs
            });
            action.addEventsToArray([], this.context);
            lastPromptArgs(this.game.promptWithHandlerMenu).cardHandler(this.cardA);
            expect(messageArgs).toHaveBeenCalledWith(this.cardA, this.player, [this.cardA]);
            expect(this.game.addMessage).toHaveBeenCalledWith('picked {0}', 'arg1', 'arg2');
        });

        it('should not add a message when message is not configured', function() {
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            lastPromptArgs(this.game.promptWithHandlerMenu).cardHandler(this.cardA);
            expect(this.game.addMessage).not.toHaveBeenCalled();
        });
    });

    describe('hasLegalTarget()', function() {
        it('should short-circuit to true when handlers are present, without consulting the gameAction', function() {
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
            const action = new CardMenuAction({
                cards: [this.cardA], gameAction: this.gameAction
            });
            action.hasTargetsChosenByInitiatingPlayer(this.context);
            expect(this.gameAction.hasTargetsChosenByInitiatingPlayer).toHaveBeenCalled();
        });
    });

    describe('getEffectMessage()', function() {
        it('should return the default choose-a-target-for template', function() {
            const action = new CardMenuAction({
                target: 'tgt', cards: [this.cardA], gameAction: this.gameAction
            });
            expect(action.getEffectMessage(this.context)).toEqual(['choose a target for {0}', [['tgt']]]);
        });
    });
});
