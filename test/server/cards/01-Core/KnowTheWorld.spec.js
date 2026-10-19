describe('Know the World', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['know-the-world']
                }
            });
            this.player1.claimRing('air');
            this.game.rings.air.conflictType = 'military';
            this.game.rings.earth.conflictType = 'political';
            this.game.rings.earth.fate = 2;
        });

        it('switches a claimed ring with an unclaimed one, which keeps the returned ring\'s conflict type', function () {
            const fate = this.player1.fate;
            this.player1.clickCard('know-the-world');
            this.player1.clickRing('air');
            this.player1.clickRing('earth');

            expect(this.game.rings.air.claimed).toBe(false);
            expect(this.game.rings.earth.claimedBy).toBe(this.player1.player.name);
            expect(this.game.rings.earth.conflictType).toBe('military');
            expect(this.player1.fate).toBe(fate - 1 + 2); // costs 1, takes the 2 fate on the ring
        });
    });
});
