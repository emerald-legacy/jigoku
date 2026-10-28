describe('Changing fate and honor by hand', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 3,
                    honor: 10
                }
            });
        });

        it('does nothing outside manual mode', function() {
            this.game.changeStat('player1', 'fate', 1);
            this.game.changeStat('player1', 'honor', -1);
            expect(this.player1.fate).toBe(3);
            expect(this.player1.honor).toBe(10);
        });

        it('works in manual mode', function() {
            this.game.manualMode = true;
            this.game.changeStat('player1', 'fate', 1);
            this.game.changeStat('player1', 'honor', -1);
            expect(this.player1.fate).toBe(4);
            expect(this.player1.honor).toBe(9);
        });
    });
});
