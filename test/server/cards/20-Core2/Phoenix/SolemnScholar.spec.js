describe('Solemn Scholar', function() {
    integration(function() {
        describe('Solemn Scholar\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger']
                    },
                    player2: {
                        inPlay: ['solemn-scholar']
                    }
                });
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.scholar = this.player2.findCardByName('solemn-scholar');
            });

            it('should not work without the earth ring in your claimed ring pool', function() {
                this.player1.claimRing('earth');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    attackers: [this.challenger],
                    defenders: []
                });
                this.player2.clickCard(this.scholar);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.challenger.bowed).toBe(false);
            });

            it('should bow an attacking character from home', function() {
                this.player2.claimRing('earth');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    attackers: [this.challenger],
                    defenders: []
                });
                this.player2.clickCard(this.scholar);
                expect(this.player2).toBeAbleToSelect(this.challenger);
                expect(this.player2).not.toBeAbleToSelect(this.scholar);
                this.player2.clickCard(this.challenger);
                expect(this.challenger.bowed).toBe(true);
            });
        });
    });
});
