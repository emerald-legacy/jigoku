describe('Consumed by Five Fires', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves'],
                    hand: ['consumed-by-five-fires']
                },
                player2: {
                    inPlay: ['doji-challenger', 'doji-whisperer']
                }
            });
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.challenger.fate = 3;
            this.whisperer.fate = 3;
        });

        it('says how much fate it removes from each character', function() {
            this.player1.clickCard('consumed-by-five-fires');
            this.player1.clickCard(this.challenger);
            this.player1.clickPrompt('3');
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('2');
            expect(this.challenger.fate).toBe(0);
            expect(this.whisperer.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain('player1 chooses to: remove 3 fate from Doji Challenger and remove 2 fate from Doji Whisperer');
        });

        it('lets the player stop before 5 fate are chosen', function() {
            this.player1.clickCard('consumed-by-five-fires');
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.challenger);
            this.player1.clickPrompt('1');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.challenger.fate).toBe(2);
            expect(this.whisperer.fate).toBe(3);
            expect(this.getChatLogs(5)).toContain('player1 chooses to: remove 1 fate from Doji Challenger');
            expect(this.player2).toHavePrompt('Action Window');
        });
    });
});
