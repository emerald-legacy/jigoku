describe('Beastmaster Matriarch', function() {
    integration(function() {
        describe('With rings in the opponent\'s claimed ring pool', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['beastmaster-matriarch'],
                        rings: ['water']
                    },
                    player2: {
                        rings: ['air', 'fire']
                    }
                });
                this.matriarch = this.player1.findCardByName('beastmaster-matriarch');
            });

            it('should get +2 military for each ring the opponent has claimed', function() {
                expect(this.player1.claimedRings).toEqual(['water']);
                expect(this.matriarch.militarySkill).toBe(7);
                expect(this.matriarch.politicalSkill).toBe(2);
            });

            it('should update when the opponent claims another ring', function() {
                this.player2.claimRing('earth');
                this.game.checkGameState(true);
                expect(this.matriarch.militarySkill).toBe(9);
            });
        });

        describe('Without rings in the opponent\'s claimed ring pool', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['beastmaster-matriarch'],
                        rings: ['water', 'void']
                    }
                });
                this.matriarch = this.player1.findCardByName('beastmaster-matriarch');
            });

            it('should not count its controller\'s claimed rings', function() {
                expect(this.player1.claimedRings.length).toBe(2);
                expect(this.matriarch.militarySkill).toBe(3);
            });
        });
    });
});
