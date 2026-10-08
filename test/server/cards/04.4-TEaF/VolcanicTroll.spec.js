describe('Volcanic Troll', function() {
    integration(function() {
        describe('Volcanic Troll\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1:{
                        inPlay: ['volcanic-troll']
                    }
                });
                this.volcanicTroll = this.player1.findCardByName('volcanic-troll');
            });

            it('should lose it\'s bonus during a fire conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['volcanic-troll'],
                    ring:'fire'
                });
                expect(this.volcanicTroll.militarySkill).toBe(3);
                expect(this.volcanicTroll.politicalSkill).toBe(3);
            });

            it('should be active while fire is unclaimed', function() {
                expect(this.volcanicTroll.militarySkill).toBe(5);
                expect(this.volcanicTroll.politicalSkill).toBe(5);
            });
        });
    });
});
