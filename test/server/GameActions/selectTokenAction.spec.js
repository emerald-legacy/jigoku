import { SelectTokenAction } from '../../../build/server/game/GameActions/SelectTokenAction.js';
import { Players } from '../../../build/server/game/Constants.js';
import { buildPlayerHarness, buildGameSpy, buildGameActionSpy, lastPromptArgs, lastPromptPlayer } from '../../../build/test/server/GameActions/_helpers.js';

describe('SelectTokenAction', function() {
    beforeEach(function() {
        this.tokenA = { name: 'token-a', type: 'token' };
        this.tokenB = { name: 'token-b', type: 'token' };
        this.card = { name: 'host', statusTokens: [this.tokenA, this.tokenB] };
        this.game = buildGameSpy(['promptWithHandlerMenu', 'addMessage']);
        ({ player: this.player, opponent: this.opponent } = buildPlayerHarness());
        this.source = { statusTokens: [] };
        this.context = { player: this.player, game: this.game, gameActionsResolutionChain: [], tokens: {}, source: this.source };
        this.gameAction = buildGameActionSpy();
    });

    describe('canAffect()', function() {
        it('should reject when card property is missing, without consulting gameAction', function() {
            const action = new SelectTokenAction({ gameAction: this.gameAction });
            expect(action.canAffect(this.tokenA, this.context)).toBe(false);
            expect(this.gameAction.hasLegalTarget).not.toHaveBeenCalled();
        });

        it('should reject when player is Opponent but no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new SelectTokenAction({ card: this.card, player: Players.Opponent, gameAction: this.gameAction });
            expect(action.canAffect(this.tokenA, this.context)).toBe(false);
            expect(this.gameAction.hasLegalTarget).not.toHaveBeenCalled();
        });

        it('should reject when tokenCondition rejects the token, without consulting gameAction', function() {
            const action = new SelectTokenAction({
                card: this.card, tokenCondition: () => false, gameAction: this.gameAction
            });
            expect(action.canAffect(this.tokenA, this.context)).toBe(false);
            expect(this.gameAction.hasLegalTarget).not.toHaveBeenCalled();
        });

        it('should ask the gameAction with subActionProperties when conditions pass', function() {
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((token) => ({ target: token, tag: token.name }));
            const action = new SelectTokenAction({
                card: this.card, gameAction: this.gameAction, subActionProperties
            });
            action.canAffect(this.tokenA, this.context);
            expect(this.gameAction.hasLegalTarget).toHaveBeenCalledWith(this.context, jasmine.objectContaining({ tag: 'token-a' }));
        });
    });

    describe('hasLegalTarget()', function() {
        it('should iterate every token on the card', function() {
            this.gameAction.hasLegalTarget.and.returnValues(false, true);
            const action = new SelectTokenAction({ card: this.card, gameAction: this.gameAction });
            const result = action.hasLegalTarget(this.context);
            expect(result).toBe(true);
            expect(this.gameAction.hasLegalTarget.calls.count()).toBe(2);
        });

        it('should return false when card is missing without inspecting tokens', function() {
            const action = new SelectTokenAction({ gameAction: this.gameAction });
            expect(action.hasLegalTarget(this.context)).toBe(false);
            expect(this.gameAction.hasLegalTarget).not.toHaveBeenCalled();
        });
    });

    describe('addEventsToArray()', function() {
        it('should not prompt when card is missing', function() {
            const action = new SelectTokenAction({ gameAction: this.gameAction });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
        });

        it('should skip prompting when player is Opponent and no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new SelectTokenAction({
                card: this.card, player: Players.Opponent, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
        });

        it('should not prompt when no token satisfies tokenCondition', function() {
            const action = new SelectTokenAction({
                card: this.card, tokenCondition: () => false, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
        });

        it('should prompt the current player by default with multiple valid tokens in singleToken mode', function() {
            const action = new SelectTokenAction({
                card: this.card, singleToken: true, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.player);
        });

        it('should prompt the opponent in singleToken mode when player is Opponent', function() {
            const action = new SelectTokenAction({
                card: this.card, player: Players.Opponent, singleToken: true, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            expect(lastPromptPlayer(this.game.promptWithHandlerMenu)).toBe(this.opponent);
        });

        it('should bypass the choice menu when singleToken=true and only one valid token exists', function() {
            const events = [];
            this.card.statusTokens = [this.tokenA];
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((tokens) => ({ target: tokens, count: Array.isArray(tokens) ? tokens.length : 1 }));
            const action = new SelectTokenAction({
                card: this.card, singleToken: true, gameAction: this.gameAction, subActionProperties
            });
            action.addEventsToArray(events, this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.context.tokens.selectToken).toEqual([this.tokenA]);
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(events, this.context, jasmine.objectContaining({ count: 1 }));
        });

        it('should bypass the prompt when singleToken is false and route every valid token through the gameAction', function() {
            const events = [];
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((tokens) => ({ target: tokens }));
            const action = new SelectTokenAction({
                card: this.card, singleToken: false, gameAction: this.gameAction, subActionProperties
            });
            action.addEventsToArray(events, this.context);
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(events, this.context, jasmine.any(Object));
            expect(this.context.tokens.selectToken).toEqual([this.tokenA, this.tokenB]);
        });

        it('should filter validTokens via gameAction.canAffect before offering choices', function() {
            this.gameAction.canAffect.and.callFake((token) => token === this.tokenB);
            const action = new SelectTokenAction({
                card: this.card, singleToken: true, gameAction: this.gameAction
            });
            action.addEventsToArray([], this.context);
            // Only tokenB is valid → length === 1 → bulk-route (no prompt)
            expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
            expect(this.context.tokens.selectToken).toEqual([this.tokenB]);
        });

        it('should route the picked token through the gameAction when a single-token handler fires', function() {
            const events = [];
            const subActionProperties = jasmine.createSpy('subActionProperties').and.callFake((token) => ({ target: token, name: token.name }));
            const action = new SelectTokenAction({
                card: this.card, singleToken: true, gameAction: this.gameAction, subActionProperties
            });
            action.addEventsToArray(events, this.context);
            lastPromptArgs(this.game.promptWithHandlerMenu).handlers[0]();
            expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(events, this.context, jasmine.objectContaining({ name: 'token-a' }));
            expect(this.context.tokens.selectToken).toBe(this.tokenA);
        });

        it('should add a message via messageArgs when a single-token handler fires and message is configured', function() {
            const messageArgs = jasmine.createSpy('messageArgs').and.returnValue(['arg']);
            const action = new SelectTokenAction({
                card: this.card, singleToken: true, gameAction: this.gameAction,
                message: 'picked', messageArgs
            });
            action.addEventsToArray([], this.context);
            lastPromptArgs(this.game.promptWithHandlerMenu).handlers[0]();
            expect(messageArgs).toHaveBeenCalledWith(this.tokenA, this.player);
            expect(this.game.addMessage).toHaveBeenCalledWith('picked', 'arg');
        });
    });

    describe('hasTargetsChosenByInitiatingPlayer()', function() {
        it('should not throw when card is missing (defaults to GameAction base behaviour)', function() {
            const action = new SelectTokenAction({ gameAction: this.gameAction });
            expect(() => action.hasTargetsChosenByInitiatingPlayer(this.context)).not.toThrow();
        });
    });

    describe('getEffectMessage()', function() {
        it('should return the default choose-a-status-token template', function() {
            const action = new SelectTokenAction({ target: 'tgt', card: this.card, gameAction: this.gameAction });
            expect(action.getEffectMessage(this.context)).toEqual(['choose a status token for {0}', [['tgt']]]);
        });

        it('should return the custom effect with effectArgs when configured', function() {
            const effectArgs = jasmine.createSpy('effectArgs').and.returnValue(['x', 'y']);
            const action = new SelectTokenAction({
                target: 'tgt', card: this.card, gameAction: this.gameAction,
                effect: 'custom effect', effectArgs
            });
            expect(action.getEffectMessage(this.context)).toEqual(['custom effect', ['x', 'y']]);
        });
    });
});
