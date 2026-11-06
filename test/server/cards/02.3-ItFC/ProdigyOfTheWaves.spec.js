describe('Prodigy of the Waves', function() {
    integration(function() {
        describe('Prodigy of the Waves\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['prodigy-of-the-waves']
                    }
                });
                this.prodigy = this.player1.findCardByName('prodigy-of-the-waves');
                this.prodigy.bow();
            });

            it('should not work while the water ring is unclaimed', function() {
                this.player1.claimRing('fire');
                this.player1.clickCard(this.prodigy);
                expect(this.prodigy.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should ready itself when you have claimed the water ring', function() {
                this.player1.claimRing('water');
                this.player1.clickCard(this.prodigy);
                expect(this.prodigy.bowed).toBe(false);
                expect(this.getChatLogs(3)).toContain('player1 uses Prodigy of the Waves to ready Prodigy of the Waves');
            });

            it('should ready itself when the opponent has claimed the water ring', function() {
                this.player2.claimRing('water');
                this.player1.clickCard(this.prodigy);
                expect(this.prodigy.bowed).toBe(false);
            });
        });
    });
});
