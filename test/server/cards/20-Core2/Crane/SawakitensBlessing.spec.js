describe('Sawakiten\'s Blessing', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'doji-whisperer'],
                    hand: ['sawakiten-s-blessing']
                },
                player2: {
                    inPlay: ['brash-samurai']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: ['brash-samurai']
            });
            this.player2.pass();
        });

        it('chooses only a participating character you control', function () {
            this.player1.clickCard('sawakiten-s-blessing');
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
        });
    });
});
