import { OptionalAction } from '../../../build/server/game/GameActions/OptionalAction.js';
import { buildPlayerHarness, buildGameSpy, buildGameActionSpy, lastPromptArgs } from '../../../build/test/server/GameActions/_helpers.js';

describe('OptionalAction', function() {
    beforeEach(function() {
        this.game = buildGameSpy(['promptWithHandlerMenu', 'addMessage']);
        ({ player: this.player } = buildPlayerHarness());
        this.context = { player: this.player, game: this.game, source: {} };
        this.gameAction = buildGameActionSpy();
        this.acceptMessage = jasmine.createSpy('acceptMessage').and.returnValue(['yes']);
        this.declineMessage = jasmine.createSpy('declineMessage').and.returnValue(['no']);
        this.action = (overrides = {}) => new OptionalAction(Object.assign({
            activePromptTitle: 'Do it?',
            gameAction: this.gameAction,
            acceptMessage: this.acceptMessage,
            declineMessage: this.declineMessage
        }, overrides));
    });

    it('asks Yes/No and resolves the action on Yes', function() {
        const events = [];
        this.action().addEventsToArray(events, this.context);
        const options = lastPromptArgs(this.game.promptWithHandlerMenu).options;
        expect(options.map((option) => option.text)).toEqual(['Yes', 'No']);
        options[0].handler();
        expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(events, this.context, {});
        expect(this.game.addMessage).toHaveBeenCalledWith(['yes']);
    });

    it('prints the decline message on No', function() {
        this.action().addEventsToArray([], this.context);
        lastPromptArgs(this.game.promptWithHandlerMenu).options[1].handler();
        expect(this.gameAction.addEventsToArray).not.toHaveBeenCalled();
        expect(this.game.addMessage).toHaveBeenCalledWith(['no']);
    });

    it('resolves without asking when required', function() {
        const events = [];
        this.action({ required: true }).addEventsToArray(events, this.context);
        expect(this.game.promptWithHandlerMenu).not.toHaveBeenCalled();
        expect(this.gameAction.addEventsToArray).toHaveBeenCalledWith(events, this.context, {});
        expect(this.game.addMessage).toHaveBeenCalledWith(['yes']);
    });
});
