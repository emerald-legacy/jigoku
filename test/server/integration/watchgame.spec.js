describe('Watching a game you played in', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict'
            });
            this.game.allowSpectators = true;
        });

        it('keeps a player who left as a player', function() {
            this.game.leave('player2');
            expect(this.game.watch('socket-2', { username: 'player2' })).toBe(false);

            expect(this.game.getPlayers().length).toBe(2);
            expect(this.game.getPlayerByName('player2')).toBe(this.player2.player);
        });

        it('still lets anyone else watch', function() {
            expect(this.game.watch('socket-3', { username: 'player3' })).toBe(true);
            expect(this.game.getSpectators().map((spectator) => spectator.name)).toEqual(['player3']);
        });
    });
});
