describe('Obligations of Hospitality', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 12,
                    inPlay: ['kakita-yoshi'],
                    hand: ['obligations-of-hospitality']
                },
                player2: {
                    honor: 8,
                    inPlay: ['brash-samurai', 'doji-whisperer']
                }
            });
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [this.brash]
            });
            this.player2.pass();
        });

        it('chooses only a character on the enemy side', function () {
            this.player1.clickCard('obligations-of-hospitality');
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
        });
    });
});
