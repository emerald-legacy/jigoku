describe('Ishiken Initiate', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    rings: ['air'],
                    inPlay: ['ishiken-initiate']
                },
                player2: {
                    rings: ['earth'],
                    inPlay: ['doji-whisperer']
                }
            });
            this.ishiken = this.player1.findCardByName('ishiken-initiate');
            this.noMoreActions();
        });

        it('gets +1/+1 for each ring claimed by either player', function() {
            expect(this.player1.claimedRings).toEqual(['air']);
            expect(this.player2.claimedRings).toEqual(['earth']);
            expect(this.ishiken.militarySkill).toBe(3);
            expect(this.ishiken.politicalSkill).toBe(3);
        });

        it('does not count the contested ring (ruling #64)', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.ishiken],
                defenders: []
            });
            expect(this.game.currentConflict.ring.element).toBe('fire');
            expect(this.game.rings.fire.contested).toBe(true);
            expect(this.game.rings.fire.isClaimed()).toBe(false);
            expect(this.ishiken.militarySkill).toBe(3);
            expect(this.ishiken.politicalSkill).toBe(3);
        });
    });
});
