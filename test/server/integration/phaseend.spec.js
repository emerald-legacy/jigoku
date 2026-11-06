describe('The end of a phase', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['pious-guardian']
                },
                player2: {
                    provinces: ['silent-ones-monastery']
                }
            });
            this.pious = this.player1.findCardByName('pious-guardian');
            this.pious.fate = 10;

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('3');
            this.noMoreActions();
            this.flow.finishConflictPhase();
        });

        it('lets interrupts to it see the ending phase', function() {
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.game.currentPhase).toBe('conflict');
        });

        it('counts honor gained by its interrupts in the ending phase', function() {
            const honor = this.player1.honor;
            this.player1.clickCard(this.pious);
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.player1.player.honorGained(this.game.roundNumber, 'conflict')).toBe(1);
        });
    });
});
