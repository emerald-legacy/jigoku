describe('Air ring when its player cannot gain honor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-toturi']
                },
                player2: {
                    inPlay: ['righteous-magistrate']
                }
            });
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.magistrate = this.player2.findCardByName('righteous-magistrate');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.toturi],
                defenders: [this.magistrate]
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
        });

        it('does not offer or report Gain 2 Honor', function() {
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 6 vs 3');
            expect(this.getChatLogs(5)).toContain('player1 chooses not to resolve the air ring');
            expect(this.getChatLogs(5)).not.toContain('player1 resolves the air ring, gaining 2 honor');
            expect(this.player1.honor).toBe(10);
        });
    });
});
