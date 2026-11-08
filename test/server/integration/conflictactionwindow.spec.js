describe('the conflict action window prompt', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.challenger = this.player2.findCardByName('doji-challenger');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.whisperer],
                defenders: [this.challenger]
            });
        });

        it('shows the conflict, the attacker and the defender on separate lines', function() {
            expect(this.player2.player.currentPrompt().menuTitle).toBe('Military Air conflict\nAttacker: 0\nDefender: 3');
        });

        it('keeps the totals on one chat line', function() {
            expect(this.getChatLogs(5)).toContain('Military Air conflict - Attacker: 0 Defender: 3');
        });
    });
});
