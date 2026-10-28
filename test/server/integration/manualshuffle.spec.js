describe('Shuffling a deck by hand', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict'
            });
            spyOn(this.player1.player, 'shuffleConflictDeck');
            spyOn(this.player1.player, 'shuffleDynastyDeck');
        });

        it('does nothing outside manual mode', function() {
            this.game.shuffleConflictDeck('player1');
            this.game.shuffleDynastyDeck('player1');
            expect(this.player1.player.shuffleConflictDeck).not.toHaveBeenCalled();
            expect(this.player1.player.shuffleDynastyDeck).not.toHaveBeenCalled();
        });

        it('works in manual mode', function() {
            this.game.manualMode = true;
            this.game.shuffleConflictDeck('player1');
            this.game.shuffleDynastyDeck('player1');
            expect(this.player1.player.shuffleConflictDeck).toHaveBeenCalled();
            expect(this.player1.player.shuffleDynastyDeck).toHaveBeenCalled();
        });
    });
});
