describe('Far Vision Path', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai'],
                    provinces: ['manicured-garden']
                },
                player2: {
                    inPlay: ['kakita-asami'],
                    provinces: ['far-vision-path', 'pilgrimage', 'ancestral-lands', 'fertile-fields'],
                    strongholdProvince: 'night-raid'
                }
            });

            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.garden = this.player1.findCardByName('manicured-garden');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.farVisionPath = this.player2.findCardByName('far-vision-path');
            this.pilgrimage = this.player2.findCardByName('pilgrimage');
            this.ancestralLands = this.player2.findCardByName('ancestral-lands');
            this.fertileFields = this.player2.findCardByName('fertile-fields');
            this.nightRaid = this.player2.findCardByName('night-raid');

            this.fertileFields.isBroken = true;
        });

        it('should move the conflict to another eligible province after it is revealed', function() {
            this.noMoreActions();
            this.initiateConflict({
                province: this.farVisionPath,
                attackers: [this.brashSamurai]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.farVisionPath);
            this.player2.clickCard(this.farVisionPath);
            expect(this.player2).toBeAbleToSelect(this.pilgrimage);
            expect(this.player2).toBeAbleToSelect(this.ancestralLands);
            expect(this.player2).not.toBeAbleToSelect(this.farVisionPath);
            expect(this.player2).not.toBeAbleToSelect(this.fertileFields);
            expect(this.player2).not.toBeAbleToSelect(this.nightRaid);
            expect(this.player2).not.toBeAbleToSelect(this.garden);
            this.player2.clickCard(this.ancestralLands);
            expect(this.game.currentConflict.getConflictProvinces()).toEqual([this.ancestralLands]);
            expect(this.ancestralLands.isConflictProvince()).toBe(true);
            expect(this.farVisionPath.isConflictProvince()).toBe(false);
        });

        it('should not trigger when another province is revealed', function() {
            this.noMoreActions();
            this.initiateConflict({
                province: this.pilgrimage,
                attackers: [this.brashSamurai]
            });
            expect(this.pilgrimage.isConflictProvince()).toBe(true);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose defenders');
        });
    });
});
