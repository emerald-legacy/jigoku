describe('Manual mode conflict result', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.game.manualMode = true;

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.berserker],
                defenders: [this.whisperer]
            });
            this.noMoreActions();
        });

        it('keeps the result chosen by hand', function() {
            expect(this.player1).toHavePrompt('How did the conflict resolve?');
            this.player1.clickPrompt('Defender Won');
            expect(this.getChatLogs(10)).toContain('player2 won a military conflict');
            expect(this.getChatLogs(10)).not.toContain('player1 won a military conflict 3 vs 0');
            expect(this.game.rings.air.isConsideredClaimed(this.player2.player)).toBe(true);
            expect(this.game.rings.air.isConsideredClaimed(this.player1.player)).toBe(false);
        });

        it('says who won once', function() {
            this.player1.clickPrompt('Defender Won');
            const results = this.getChatLogs(10).filter((line) => line.includes('won a military conflict'));
            expect(results).toEqual(['player2 won a military conflict']);
        });
    });
});
