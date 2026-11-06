import { ChatCommands } from '../../../build/server/game/ChatCommands.js';

describe('ChatCommands', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'promptForSelect', 'promptWithHandlerMenu', 'getFrameworkContext', 'queueStep','queueSimpleStep', 'openEventWindow']);
        this.gameSpy.getFrameworkContext.and.returnValue({ game: this.gameSpy, player: this.playerSpy });

        this.gameSpy.manualMode = true;
        this.gameSpy.rules = { imperialFavorHasSides: true, imperialFavorSovereign: 'Emperor\'s' };

        this.playerSpy = jasmine.createSpyObj('player', ['drawCardsToHand', 'discardAtRandom', 'discardFromDraw', 'loseImperialFavor']);
        this.chatCommands = new ChatCommands(this.gameSpy);
    });

    describe('getNumberOrDefault()', function() {
        describe('with no arguments', function() {
            it('should return the default', function () {
                expect(this.chatCommands.getNumberOrDefault('', 1)).toBe(1);
            });
        });

        describe('with a string argument', function() {
            it('should return the default', function () {
                expect(this.chatCommands.getNumberOrDefault('test', 1)).toBe(1);
            });
        });

        describe('with a negative argument', function() {
            it('should return the default', function () {
                expect(this.chatCommands.getNumberOrDefault('-1', 1)).toBe(1);
            });
        });

        describe('with a valid argument', function() {
            it('should return the parsed value', function () {
                expect(this.chatCommands.getNumberOrDefault('3', 1)).toBe(3);
            });
        });
    });

    describe('executeCommand()', function() {
        describe('with a non-existent command', function() {
            it('should return false', function() {
                const result = this.chatCommands.executeCommand(this.playerSpy, '/foo', ['/foo', 'bar']);

                expect(result).toBe(false);
            });
        });

        describe('with a valid command', function() {
            it('should return true', function() {
                const result = this.chatCommands.executeCommand(this.playerSpy, '/dishonor', ['/dishonor']);

                expect(result).toBe(true);
            });
        });

        describe('outside manual mode', function() {
            it('should not run a command that changes the game state', function() {
                this.gameSpy.manualMode = false;
                const result = this.chatCommands.executeCommand(this.playerSpy, '/draw', ['/draw']);

                expect(result).toBe(true);
                expect(this.playerSpy.drawCardsToHand).not.toHaveBeenCalled();
                expect(this.gameSpy.addMessage).not.toHaveBeenCalled();
            });

            it('should still roll a die', function() {
                this.gameSpy.manualMode = false;
                this.chatCommands.executeCommand(this.playerSpy, '/roll', ['/roll', '6']);

                expect(this.gameSpy.addMessage).toHaveBeenCalledTimes(1);
            });
        });

        describe('with a /draw command', function() {
            describe('with no arguments', function() {
                it('should draw 1 card', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/draw', ['/draw']);

                    expect(this.playerSpy.drawCardsToHand).toHaveBeenCalledWith(1);
                });
            });

            describe('with a string argument', function() {
                it('should draw 1 card', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/draw', ['/draw', 'test']);

                    expect(this.playerSpy.drawCardsToHand).toHaveBeenCalledWith(1);
                });
            });

            describe('with a negative argument', function() {
                it('should draw 1 card', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/draw', ['/draw', '-1']);

                    expect(this.playerSpy.drawCardsToHand).toHaveBeenCalledWith(1);
                });
            });

            describe('with a valid argument', function() {
                it('should draw the passed amount of cards', function () {
                    this.chatCommands.executeCommand(this.playerSpy, '/draw', ['/draw', '4']);

                    expect(this.playerSpy.drawCardsToHand).toHaveBeenCalledWith(4);
                });
            });
        });

        describe('with a /roll command', function() {
            it('should roll a die with the passed number of sides', function () {
                this.chatCommands.executeCommand(this.playerSpy, '/roll', ['/roll', '6']);

                expect(this.gameSpy.addMessage).toHaveBeenCalledTimes(1);
            });

            it('should not roll a die with more than 1000 sides', function () {
                expect(() => this.chatCommands.executeCommand(this.playerSpy, '/roll', ['/roll', '99999999999999999999'])).not.toThrow();

                expect(this.gameSpy.addMessage).not.toHaveBeenCalled();
            });
        });

        describe('with a /claim-favor command', function() {
            it('should claim the military favor with no argument', function () {
                this.chatCommands.executeCommand(this.playerSpy, '/claim-favor', ['/claim-favor']);

                expect(this.playerSpy.imperialFavor).toBe('military');
            });

            it('should claim the favor that was named', function () {
                this.chatCommands.executeCommand(this.playerSpy, '/claim-favor', ['/claim-favor', 'political']);

                expect(this.playerSpy.imperialFavor).toBe('political');
            });

            it('should ask for the side when the argument names none', function () {
                this.chatCommands.executeCommand(this.playerSpy, '/claim-favor', ['/claim-favor', 'sideways']);

                expect(this.gameSpy.promptWithHandlerMenu).toHaveBeenCalledWith(this.playerSpy, jasmine.objectContaining({ source: 'Imperial Favor' }));
                expect(this.playerSpy.imperialFavor).toBeUndefined();
            });
        });
    });
});
