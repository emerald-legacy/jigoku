describe('Drawing the Void', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-kaede', 'miya-mystic'],
                    hand: ['drawing-the-void']
                },
                player2: {
                    hand: ['regal-bearing', 'reprieve']
                }
            });

            this.akodoKaede = this.player1.findCardByName('akodo-kaede');
            this.drawingTheVoid = this.player1.findCardByName('drawing-the-void');

            this.regalBearing = this.player2.findCardByName('regal-bearing');
            this.reprieve = this.player2.findCardByName('reprieve');
        });

        it('reveals two cards and remove one from the game, with affinity the player chooses the card', function () {
            this.player1.clickCard(this.drawingTheVoid);
            expect(this.getChatLogs(5)).toContain(
                'player1 plays Drawing the Void to reveal 2 random cards from player2\'s hand and remove one from the game'
            );
            expect(this.getChatLogs(5)).toContain(
                'player2 reveals Regal Bearing and Reprieve from their hand - the void reveals...'
            );
            expect(this.player1).toHavePrompt('Choose a card to remove from the game');
            expect(this.player1).toHavePromptButton('Regal Bearing');
            expect(this.player1).toHavePromptButton('Reprieve');

            this.player1.clickPrompt('Regal Bearing');
            expect(this.getChatLogs(5)).toContain('player1 removes Regal Bearing from the game - the void consumes');
            expect(this.regalBearing.location).toBe('removed from game');
            expect(this.player1.hand.length).toBe(1);

            expect(this.player2).toHavePrompt('Initiate an action');
        });

        it('reveals two cards and remove one from the game, without affinity player still chooses but does not draw', function () {
            this.player1.moveCard(this.akodoKaede, 'dynasty deck');

            this.player1.clickCard(this.drawingTheVoid);
            expect(this.getChatLogs(5)).toContain(
                'player2 reveals Regal Bearing and Reprieve from their hand - the void reveals...'
            );
            expect(this.player1).toHavePrompt('Choose a card to remove from the game');
            expect(this.player1).toHavePromptButton('Regal Bearing');
            expect(this.player1).toHavePromptButton('Reprieve');

            this.player1.clickPrompt('Regal Bearing');
            expect(this.getChatLogs(5)).toContain('player1 removes Regal Bearing from the game - the void consumes');
            expect(this.regalBearing.location).toBe('removed from game');
            // Without affinity, no card is drawn
            expect(this.player1.hand.length).toBe(0);

            expect(this.player2).toHavePrompt('Initiate an action');
        });
    });
});

describe('Drawing the Void with only an attached Shugenja', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['doji-whisperer'],
                    hand: ['drawing-the-void', 'togashi-kazue']
                },
                player2: {
                    hand: ['regal-bearing', 'reprieve']
                }
            });

            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.drawingTheVoid = this.player1.findCardByName('drawing-the-void');
            this.kazue = this.player1.findCardByName('togashi-kazue');
            this.kazue.traits = [...this.kazue.traits, 'shugenja'];

            this.player1.clickCard(this.kazue);
            this.player1.clickPrompt('Play Togashi Kazue as an attachment');
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.attachments).toContain(this.kazue);
            this.player2.pass();
        });

        it('should not be playable', function () {
            this.player1.clickCard(this.drawingTheVoid);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.drawingTheVoid.location).toBe('hand');
        });
    });
});
