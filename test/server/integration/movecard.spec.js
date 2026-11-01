describe('Moving a card', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['fine-katana']
                }
            });
            this.katana = this.player1.findCardByName('fine-katana');
        });

        it('leaves the card where it is when the destination is illegal for it', function() {
            this.player1.player.moveCard(this.katana, 'dynasty deck');
            expect(this.katana.location).toBe('hand');
            expect(this.player1.player.hand).toContain(this.katana);
        });

        it('moves the card within its own pile', function() {
            this.player1.player.moveCard(this.katana, 'conflict deck');
            this.player1.player.moveCard(this.katana, 'conflict deck', { bottom: true });
            const deck = this.player1.player.conflictDeck;
            expect(deck[deck.length - 1]).toBe(this.katana);
            expect(deck.filter((card) => card === this.katana).length).toBe(1);
        });
    });
});
