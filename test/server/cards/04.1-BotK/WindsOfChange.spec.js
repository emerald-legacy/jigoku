describe('Winds of Change', function () {
    integration(function () {
        describe('Winds of Change\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['winds-of-change']
                    }
                });
            });

            it('should do nothing if the air ring is unclaimed', function () {
                this.player1.clickCard('winds-of-change');
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            it('should return the air ring to the unclaimed pool if it is claimed', function () {
                this.game.rings.air.claimRing(this.player1);
                this.player1.clickCard('winds-of-change');
                expect(this.game.rings.air.claimed).toBe(false);
                expect(this.getChatLogs(3)).toContain('player1 plays Winds of Change to return the air ring to the unclaimed pool');
            });

            it('should return the air ring from the opponent\'s claimed ring pool', function() {
                this.game.rings.air.claimRing(this.player2.player);
                this.player1.clickCard('winds-of-change');
                expect(this.game.rings.air.claimed).toBe(false);
                expect(this.game.rings.air.claimedBy).toBeFalsy();
                expect(this.getChatLogs(3)).toContain('player1 plays Winds of Change to return the air ring to the unclaimed pool');
            });
        });
    });
});
