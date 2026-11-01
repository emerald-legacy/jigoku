describe('Breaking a stronghold province by hand', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict'
            });
            this.game.manualMode = true;
            this.strongholdProvince = this.player2.player.strongholdProvince.find((card) => card.isProvince);
            this.strongholdProvince.facedown = false;
        });

        it('gives the win to the province controller\'s opponent', function() {
            this.player1.clickMenu(this.strongholdProvince, 'Break/unbreak this province');
            expect(this.strongholdProvince.isBroken).toBe(true);
            expect(this.game.winner).toBe(this.player1.player);
        });
    });
});
