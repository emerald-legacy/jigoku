describe('Manual mode toggle', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict'
            });
        });

        it('can be switched by a player', function() {
            this.game.toggleManualMode('player1');
            expect(this.game.manualMode).toBe(true);
        });

        it('cannot be switched by someone who is not a player', function() {
            this.game.toggleManualMode('spectator');
            expect(this.game.manualMode).toBe(false);
        });
    });
});
