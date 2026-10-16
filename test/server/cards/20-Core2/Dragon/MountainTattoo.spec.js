describe('Mountain Tattoo', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-initiate'],
                    hand: ['mountain-tattoo']
                },
                player2: {
                    inPlay: ['togashi-initiate']
                }
            });
            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.opponentsInitiate = this.player2.findCardByName('togashi-initiate');
        });

        it('attaches only to a Monk you control', function () {
            this.player1.clickCard('mountain-tattoo');
            expect(this.player1).toBeAbleToSelect(this.initiate);
            expect(this.player1).not.toBeAbleToSelect(this.opponentsInitiate);
        });
    });
});
