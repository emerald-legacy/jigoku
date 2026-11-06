describe('Status token costs', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer'],
                    hand: ['way-of-the-crane']
                },
                player2: {
                    inPlay: ['master-of-the-court']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.master = this.player2.findCardByName('master-of-the-court');
            this.crane = this.player1.findCardByName('way-of-the-crane');
        });

        it('discard only the status token they name from the source', function () {
            this.master.honor();
            this.master.taint();
            this.player1.clickCard(this.crane);
            this.player1.clickCard(this.whisperer);
            this.player2.clickCard(this.master);
            expect(this.master.isHonored).toBe(false);
            expect(this.master.isTainted).toBe(true);
        });
    });
});
