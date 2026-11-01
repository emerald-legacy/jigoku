describe('Funeral Pyre', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'doji-whisperer'],
                    dynastyDiscard: ['funeral-pyre']
                },
                player2: {
                    inPlay: ['kakita-asami']
                }
            });
            this.pyre = this.player1.placeCardInProvince('funeral-pyre', 'province 1');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.asami = this.player2.findCardByName('kakita-asami');
        });

        it('sacrifices a friendly character to draw 1 card', function() {
            const topCard = this.player1.conflictDeck[0];
            this.player1.clickCard(this.pyre);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.asami);
            this.player1.clickCard(this.brash);
            expect(this.brash.location).toBe('dynasty discard pile');
            expect(topCard.location).toBe('hand');
            expect(this.player1.hand.length).toBe(1);
            expect(this.asami.location).toBe('play area');
        });
    });
});
