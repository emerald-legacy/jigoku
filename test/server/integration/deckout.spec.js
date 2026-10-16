describe('Running out of cards', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 11
                }
            });
            this.player1.reduceDeckToNumber('conflict deck', 0);
            for(const card of [...this.player1.player.conflictDiscardPile]) {
                this.player1.moveCard(card, 'removed from game');
            }
        });

        it('stops drawing when the deck and the discard pile are both empty', function() {
            const handSize = this.player1.hand.length;
            this.player1.player.drawCardsToHand(3);
            this.game.continue();
            expect(this.player1.hand.length).toBe(handSize);
            expect(this.player1.honor).toBe(6);
        });
    });
});
