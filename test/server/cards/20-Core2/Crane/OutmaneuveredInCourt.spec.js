describe('Outmaneuvered in Court', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'kakita-yoshi'],
                    hand: ['outmaneuvered-in-court']
                },
                player2: {
                    inPlay: ['brash-samurai']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.player1.player.imperialFavor = 'political';
        });

        it('chooses any non-unique character at home', function () {
            this.player1.clickCard('outmaneuvered-in-court');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
        });

        it('discards the Imperial Favor and bows the chosen character', function () {
            this.player1.clickCard('outmaneuvered-in-court');
            this.player1.clickCard(this.brash);
            expect(this.brash.bowed).toBe(true);
            expect(this.player1.player.imperialFavor).toBe('');
            expect(this.player2.player.imperialFavor).toBe('');
        });

        it('cannot be played without the Imperial Favor', function () {
            this.player1.player.imperialFavor = '';
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard('outmaneuvered-in-court');
            expect(this.player1.findCardByName('outmaneuvered-in-court').location).toBe('hand');
            expect(this.brash.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
