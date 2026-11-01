describe('Forgotten Library', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    dynastyDiscard: ['forgotten-library']
                }
            });
            this.library = this.player1.placeCardInProvince('forgotten-library', 'province 1');
        });

        it('draws 1 card when the draw phase begins', function() {
            const topCard = this.player1.conflictDeck[0];
            expect(this.player1.hand.length).toBe(0);
            this.nextPhase();
            expect(this.game.currentPhase).toBe('draw');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.library);
            this.player1.clickCard(this.library);
            expect(topCard.location).toBe('hand');
            expect(this.player1.hand.length).toBe(1);
        });
    });
});
