describe('I Am Ready', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        { card: 'border-rider', fate: 1, bowed: true },
                        { card: 'shinjo-outrider', fate: 1, bowed: true, attachments: ['stinger'] }
                    ],
                    hand: ['i-am-ready']
                }
            });
            this.rider = this.player1.findCardByName('border-rider');
            this.outrider = this.player1.findCardByName('shinjo-outrider');
        });

        it('readies a bowed Unicorn character by removing 1 fate from it', function () {
            this.player1.clickCard('i-am-ready');
            expect(this.player1).toBeAbleToSelect(this.rider);
            this.player1.clickCard(this.rider);
            expect(this.rider.bowed).toBe(false);
            expect(this.rider.fate).toBe(0);
        });

        it('can\'t choose a character that can\'t be readied', function () {
            this.player1.clickCard('i-am-ready');
            expect(this.player1).not.toBeAbleToSelect(this.outrider);
        });
    });
});
