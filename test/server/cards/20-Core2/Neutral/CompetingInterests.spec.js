describe('Competing Interests', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-yoshi', 'doji-whisperer'],
                    hand: ['competing-interests']
                },
                player2: {
                    inPlay: ['akodo-toturi', 'kakita-toshimoko']
                }
            });
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi, this.whisperer],
                defenders: [this.toturi, this.toshimoko]
            });
            this.player2.pass();
        });

        it('chooses any participating unique character', function () {
            this.player1.clickCard('competing-interests');
            expect(this.player1).toBeAbleToSelect(this.yoshi);
            expect(this.player1).toBeAbleToSelect(this.toturi);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
        });
    });
});
