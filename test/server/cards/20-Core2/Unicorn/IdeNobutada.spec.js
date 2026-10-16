describe('Ide Nobutada', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['fine-katana'],
                    inPlay: ['ide-nobutada'],
                    dynastyDiscard: ['shinjo-takame']
                }
            });

            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.ideNobutada = this.player1.findCardByName('ide-nobutada');
            this.shinjoTakame = this.player1.moveCard('shinjo-takame', 'dynasty deck');

            this.ideNobutada.honor();
            this.ideNobutada.modifyFate(1);
            this.player1.playAttachment(this.fineKatana, this.ideNobutada);
            this.player2.pass();
        });

        it('shuffles the dynasty deck when it takes nothing', function () {
            this.player1.clickCard(this.ideNobutada);
            this.player1.clickPrompt('Take nothing');
            expect(this.ideNobutada.location).toBe('play area');
            expect(this.getChatLogs(5)).toContain('player1 finds no copies of Shinjo Takame');
            expect(this.getChatLogs(5)).toContain('player1 is shuffling their dynasty deck');
        });

        it('replaces itself with Shinjo Takame', function () {
            this.player1.clickCard(this.ideNobutada);
            expect(this.player1).toHavePrompt('Find a copy of Shinjo Takame');
            expect(this.player1).toHavePromptButton('Shinjo Takame');

            this.player1.clickPrompt('Shinjo Takame');
            expect(this.ideNobutada.location).toBe('dynasty deck');
            expect(this.shinjoTakame.location).toBe('play area');
            expect(this.shinjoTakame.attachments).toContain(this.fineKatana);
            expect(this.shinjoTakame.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain('player1 replaces Ide Nobutada with Shinjo Takame');
            expect(this.getChatLogs(5)).toContain('player1 is shuffling their dynasty deck');

            this.player1.clickCard(this.shinjoTakame);
            expect(this.player1).not.toHavePrompt('Find a copy of Ide Nobutada');
        });
    });
});
