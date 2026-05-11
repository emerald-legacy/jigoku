describe('Origami Master', function() {
    integration(function() {
        describe('Origami Master\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['origami-master', 'miya-mystic', 'adept-of-the-waves']
                    },
                    player2: {
                        inPlay: ['border-rider']
                    }
                });
                this.origamiMaster = this.player1.findCardByName('origami-master');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.origamiMaster.honor();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['origami-master'],
                    defenders: []
                });
            });

            it('should not allow selecting self as target', function() {
                this.player2.pass();
                this.player1.clickCard(this.origamiMaster);
                expect(this.player1).not.toBeAbleToSelect(this.origamiMaster);
                expect(this.player1).toBeAbleToSelect(this.miyaMystic);
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
            });

            it('should move the honored status token to another character', function() {
                this.player2.pass();
                this.player1.clickCard(this.origamiMaster);
                this.player1.clickCard(this.miyaMystic);
                expect(this.origamiMaster.isHonored).toBe(false);
                expect(this.miyaMystic.isHonored).toBe(true);
            });
        });
    });
});
