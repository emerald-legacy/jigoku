describe('Ready for Battle and a rule bowing a character', function () {
    integration(function () {
        it('does not react when an illegal participant is sent home bowed', function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'doji-kuwanan', attachments: ['shukujo'] }]
                },
                player2: {
                    inPlay: ['matsu-berserker'],
                    hand: ['ready-for-battle']
                }
            });
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.kuwanan],
                defenders: [this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.kuwanan);
            this.player1.clickPrompt('Switch the conflict type');

            expect(this.game.currentConflict.conflictType).toBe('political');
            expect(this.berserker.bowed).toBe(true);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });
    });
});
