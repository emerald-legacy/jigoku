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

describe('Know the World rulings', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer'],
                    hand: ['know-the-world', 'wholeness-of-the-world']
                }
            });
            this.player1.claimRing('air');
            this.game.rings.earth.fate = 2;
        });

        it('cannot switch the contested ring (#144)', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                ring: 'fire',
                attackers: ['doji-whisperer'],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard('know-the-world');
            this.player1.clickRing('air');
            expect(this.player1).toBeAbleToSelectRing('earth');
            expect(this.player1).not.toBeAbleToSelectRing('fire');
        });

        it('keeps the old ring and gains the new one when interrupted by Wholeness of the World (#342)', function () {
            this.player1.clickCard('know-the-world');
            this.player1.clickRing('air');
            this.player1.clickRing('earth');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard('wholeness-of-the-world');
            expect(this.game.rings.air.claimedBy).toBe(this.player1.player.name);
            expect(this.game.rings.earth.claimedBy).toBe(this.player1.player.name);
        });
    });
});
