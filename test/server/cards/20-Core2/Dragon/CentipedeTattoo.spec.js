describe('Centipede Tattoo', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['disciple-of-shinsei'],
                    hand: ['centipede-tattoo']
                }
            });

            this.disciple = this.player1.findCardByName('disciple-of-shinsei');
            this.tattoo = this.player1.findCardByName('centipede-tattoo');
        });

        it('gives the Tattooed trait', function () {
            expect(this.disciple.hasTrait('tattooed')).toBe(false);
            this.player1.playAttachment(this.tattoo, this.disciple);
            expect(this.disciple.hasTrait('tattooed')).toBe(true);
        });
    });
});
