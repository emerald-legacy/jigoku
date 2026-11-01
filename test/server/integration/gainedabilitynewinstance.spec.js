describe('Abilities gained from other cards by a new instance of a card', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-deceiver', 'doji-kuwanan']
                },
                player2: {
                    inPlay: ['beloved-advisor']
                }
            });
            this.deceiver = this.player1.findCardByName('shosuro-deceiver');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.advisor = this.player2.findCardByName('beloved-advisor');
            this.advisor.dishonor();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan, this.deceiver],
                defenders: [this.advisor],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.deceiver);
            expect(this.getChatLogs(5)).toContain('player1 uses Shosuro Deceiver\'s gained ability from Beloved Advisor to make player1 and player2 draw 1 card');
        });

        it('keep the used limit while the card stays in play', function() {
            this.player2.pass();
            const hand = this.player1.hand.length;
            this.player1.clickCard(this.deceiver);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1.hand.length).toBe(hand);
        });

        it('have no memory of the use once the card left play and came back', function() {
            this.player1.moveCard(this.deceiver, 'dynasty discard pile');
            expect(this.deceiver.location).toBe('dynasty discard pile');
            this.player1.moveCard(this.deceiver, 'play area');
            this.game.currentConflict.addAttacker(this.deceiver);
            this.game.checkGameState(true);
            this.player2.pass();

            const hand = this.player1.hand.length;
            this.player1.clickCard(this.deceiver);
            expect(this.player1.hand.length).toBe(hand + 1);
            expect(this.getChatLogs(5)).toContain('player1 uses Shosuro Deceiver\'s gained ability from Beloved Advisor to make player1 and player2 draw 1 card');
        });
    });
});
