describe('Niten Adept', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['niten-adept'],
                    hand: ['fine-katana']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    hand: ['fine-katana']
                }
            });
            this.adept = this.player1.findCardByName('niten-adept');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.katana = this.player1.findCardByName('fine-katana');
        });

        it('needs an attachment you control on it', function () {
            this.player1.pass();
            this.player2.playAttachment('fine-katana', this.adept);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adept],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.adept);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('bows a participating character without attachments, without bowing the attachment', function () {
            this.player1.playAttachment(this.katana, this.adept);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adept],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.adept);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.bowed).toBe(true);
            expect(this.katana.bowed).toBe(false);
        });
    });
});
