import { ChooseGameAction } from '../../../build/server/game/GameActions/ChooseGameAction.js';

describe('ChooseGameAction', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['promptWithHandlerMenu', 'addMessage', 'queueSimpleStep']);
        this.opponent = { name: 'opp' };
        this.player = { name: 'self', opponent: this.opponent };
        this.context = { player: this.player, game: this.game };
        this.actionA = jasmine.createSpyObj('actionA', ['setDefaultTarget', 'hasLegalTarget', 'addEventsToArray', 'canAffect', 'hasTargetsChosenByInitiatingPlayer']);
        this.actionA.hasLegalTarget.and.returnValue(true);
        this.actionA.canAffect.and.returnValue(true);
        this.actionB = jasmine.createSpyObj('actionB', ['setDefaultTarget', 'hasLegalTarget', 'addEventsToArray', 'canAffect', 'hasTargetsChosenByInitiatingPlayer']);
        this.actionB.hasLegalTarget.and.returnValue(true);
        this.actionB.canAffect.and.returnValue(true);
    });

    describe('getProperties()', function() {
        it('should install setDefaultTarget on every option action', function() {
            const action = new ChooseGameAction({
                target: 'tgt',
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
                player: 'opponent',
                options: { A: { action: this.actionA } }
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu.calls.mostRecent().args[0]).toBe(this.opponent);
        });

        it('should fall back to current player when player is Opponent but no opponent exists', function() {
            this.player.opponent = undefined;
            const action = new ChooseGameAction({
                player: 'opponent',
                options: { A: { action: this.actionA } }
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu.calls.mostRecent().args[0]).toBe(this.player);
        });

        it('should default to the current player when player is unspecified', function() {
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA } }
            });
            action.addEventsToArray([], this.context);
            expect(this.game.promptWithHandlerMenu.calls.mostRecent().args[0]).toBe(this.player);
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
            expect(this.game.promptWithHandlerMenu.calls.mostRecent().args[1].choices).toEqual(['A']);
        });

        it('should route the chosen action through addEventsToArray when the choice handler fires', function() {
            const events = [];
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA }, B: { action: this.actionB } }
            });
            action.addEventsToArray(events, this.context);
            const choiceHandler = this.game.promptWithHandlerMenu.calls.mostRecent().args[1].choiceHandler;
            choiceHandler('B');
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
            const choiceHandler = this.game.promptWithHandlerMenu.calls.mostRecent().args[1].choiceHandler;
            choiceHandler('A');
            expect(this.game.addMessage).toHaveBeenCalledWith('msg', this.player, ['tgt']);
        });

        it('should not add a message when the chosen option has none', function() {
            const action = new ChooseGameAction({
                options: { A: { action: this.actionA } }
            });
            action.addEventsToArray([], this.context);
            const choiceHandler = this.game.promptWithHandlerMenu.calls.mostRecent().args[1].choiceHandler;
            choiceHandler('A');
            expect(this.game.addMessage).not.toHaveBeenCalled();
        });
    });
});
