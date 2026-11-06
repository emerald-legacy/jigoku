describe('Shochu Brawl', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger'],
                    hand: ['shochu-brawl']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.brawl = this.player1.findCardByName('shochu-brawl');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('should bow the loser and dishonor the winner of a military duel', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.brawl);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.whisperer.bowed).toBe(true);
            expect(this.whisperer.isDishonored).toBe(false);
            expect(this.challenger.bowed).toBe(false);
            expect(this.challenger.isDishonored).toBe(true);
        });

        it('should not be playable in a military conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.brawl);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.brawl.location).toBe('hand');
        });
    });
});
