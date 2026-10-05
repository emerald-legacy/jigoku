describe('Beloved Advisor', function() {
    integration(function() {
        describe('Beloved Advisor\'s effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['beloved-advisor']
                    }
                });
                this.belovedAdvisor = this.player1.findCardByName('beloved-advisor');
            });

            it('should make each player 1 card', function() {
                const hand = this.player1.hand.length;
                const hand2 = this.player2.hand.length;
                this.player1.clickCard(this.belovedAdvisor);
                expect(this.player1.hand.length).toBe(hand + 1);
                expect(this.player2.hand.length).toBe(hand2 + 1);
            });
        });
    });
});
