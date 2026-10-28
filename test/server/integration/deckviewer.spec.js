describe('Looking at your own deck', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict'
            });
        });

        it('shows the conflict deck to its owner only', function() {
            this.game.showConflictDeck('player1');

            const own = this.player1.player.getState(this.player1.player).cardPiles.conflictDeck;
            expect(own.length).toBe(this.player1.player.conflictDeck.length);
            expect(own[0].id).toBe(this.player1.player.conflictDeck[0].id);

            expect(this.player1.player.getState(this.player2.player).cardPiles.conflictDeck).toBeUndefined();
            expect(this.game.getState().players.player1.cardPiles.conflictDeck).toBeUndefined();
        });

        it('shows the dynasty deck to its owner only', function() {
            this.game.showDynastyDeck('player1');

            const own = this.player1.player.getState(this.player1.player).cardPiles.dynastyDeck;
            expect(own.length).toBe(this.player1.player.dynastyDeck.length);
            expect(own[0].id).toBe(this.player1.player.dynastyDeck[0].id);

            expect(this.player1.player.getState(this.player2.player).cardPiles.dynastyDeck).toBeUndefined();
            expect(this.game.getState().players.player1.cardPiles.dynastyDeck).toBeUndefined();
        });
    });
});
