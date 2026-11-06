import { GameMode } from '../../../build/server/GameMode.js';

describe('Copies of an attachment on one card', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                gameMode: GameMode.Emerald,
                player1: {
                    inPlay: [{ card: 'bayushi-liar', attachments: ['fine-katana'] }],
                    hand: ['calling-in-favors']
                },
                player2: {
                    inPlay: [{ card: 'doji-whisperer', attachments: ['fine-katana'] }]
                }
            });
            this.liar = this.player1.findCardByName('bayushi-liar');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.ownKatana = this.player1.findCardByName('fine-katana');
            this.stolenKatana = this.player2.findCardByName('fine-katana');
        });

        it('cannot be attached by taking control of another copy', function() {
            this.player1.clickCard('calling-in-favors');
            this.player1.clickCard(this.stolenKatana);
            this.player1.clickCard(this.liar);

            expect(this.liar.attachments.length).toBe(1);
            expect(this.liar.attachments).toContain(this.ownKatana);
            expect(this.stolenKatana.location).toBe('conflict discard pile');
        });

        it('are reduced to one, chosen by the card\'s controller', function() {
            this.player2.player.removeCardFromPile(this.stolenKatana);
            this.whisperer.removeAttachment(this.stolenKatana);
            this.liar.attachments.push(this.stolenKatana);
            this.stolenKatana.parent = this.liar;
            this.stolenKatana.controller = this.player1.player;
            this.game.checkGameState(true);
            this.game.continue();

            expect(this.player1).toHavePrompt('Choose which Fine Katana to keep');
            this.player1.clickCard(this.stolenKatana);
            expect(this.liar.attachments.length).toBe(1);
            expect(this.liar.attachments).toContain(this.stolenKatana);
            expect(this.ownKatana.location).toBe('conflict discard pile');
            expect(this.getChatLogs(1)).toContain('player1 discards Fine Katana from Bayushi Liar, as only one copy can be attached');
        });
    });
});
