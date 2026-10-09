import { rulesFor } from '../../../build/server/game/GameRules.js';
import { MenuPrompt } from '../../../build/server/game/gamesteps/MenuPrompt.js';
import Player from '../../../build/server/game/Player.js';

describe('the MenuPrompt', function() {
    beforeEach(function() {
        var game = new jasmine.createSpyObj('game', ['playerDecked', 'emitEvent', 'addMessage', 'getOtherPlayer']);
        game.rules = rulesFor('stronghold');

        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, game);
        this.player.initialise();
        this.otherPlayer = new Player('2', { username: 'Player 2', settings: {} }, false, game);
        this.otherPlayer.initialise();
        game.playersAndSpectators = {};
        game.playersAndSpectators[this.player.name] = this.player;
        game.playersAndSpectators[this.otherPlayer.name] = this.otherPlayer;

        this.handlers = {
            doIt: jasmine.createSpy('doIt'),
            forbiddenMethod: jasmine.createSpy('forbiddenMethod')
        };

        this.properties = {
            activePrompt: {
                buttons: [{ command: 'menuButton', text: 'Do it!', method: 'doIt' }]
            }
        };

        this.arg = 123;

        this.prompt = new MenuPrompt(game, this.player, this.handlers, this.properties);
    });

    describe('the onMenuCommand() function', function() {
        describe('when the player is not the prompted player', function() {
            it('should return false', function() {
                expect(this.prompt.onMenuCommand(this.otherPlayer, this.arg, this.prompt.uuid, 'doIt')).toBe(false);
            });

            it('should not complete the prompt', function() {
                this.prompt.onMenuCommand(this.otherPlayer, this.arg, this.prompt.uuid, 'doIt');
                expect(this.prompt.isComplete()).toBe(false);
            });
        });

        describe('when the method does not exist', function() {
            it('should return false', function() {
                expect(this.prompt.onMenuCommand(this.player, this.arg, this.prompt.uuid, 'unknownMethod')).toBe(false);
            });

            it('should not complete the prompt', function() {
                this.prompt.onMenuCommand(this.player, this.arg, this.prompt.uuid, 'unknownMethod');
                expect(this.prompt.isComplete()).toBe(false);
            });
        });

        describe('when a handler exists that no button names', function() {
            it('should not call it', function() {
                expect(this.prompt.onMenuCommand(this.player, this.arg, this.prompt.uuid, 'forbiddenMethod')).toBe(false);
                expect(this.handlers.forbiddenMethod).not.toHaveBeenCalled();
            });
        });

        describe('when the method is only inherited by the handlers object', function() {
            it('should return false', function() {
                this.properties.activePrompt.buttons.push({ command: 'menuButton', text: 'Odd', method: 'toString' });
                expect(this.prompt.onMenuCommand(this.player, this.arg, this.prompt.uuid, 'toString')).toBe(false);
                expect(this.prompt.isComplete()).toBe(false);
            });
        });

        describe('when the method exists', function() {
            describe('when the method has a corresponding button', function() {
                it('should call the handler with the player and the arg', function() {
                    this.prompt.onMenuCommand(this.player, this.arg, this.prompt.uuid, 'doIt');
                    expect(this.handlers.doIt).toHaveBeenCalledWith(this.player, this.arg);
                });

                describe('when the method returns false', function() {
                    beforeEach(function() {
                        this.handlers.doIt.and.returnValue(false);
                    });

                    it('should not complete the prompt', function() {
                        this.prompt.onMenuCommand(this.player, this.arg, this.prompt.uuid, 'doIt');
                        expect(this.prompt.isComplete()).toBe(false);
                    });

                    it('should return true', function() {
                        expect(this.prompt.onMenuCommand(this.player, this.arg, this.prompt.uuid, 'doIt')).toBe(true);
                    });
                });

                describe('when the method returns true', function() {
                    beforeEach(function() {
                        this.handlers.doIt.and.returnValue(true);
                    });

                    it('should complete the prompt', function() {
                        this.prompt.onMenuCommand(this.player, this.arg, this.prompt.uuid, 'doIt');
                        expect(this.prompt.isComplete()).toBe(true);
                    });

                    it('should return true', function() {
                        expect(this.prompt.onMenuCommand(this.player, this.arg, this.prompt.uuid, 'doIt')).toBe(true);
                    });
                });
            });
        });
    });
});
