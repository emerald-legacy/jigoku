describe('Way of the Unicorn', function() {
    integration(function() {
        describe('in the first player\'s hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        hand: ['way-of-the-unicorn']
                    }
                });
                this.unicorn = this.player1.findCardByName('way-of-the-unicorn');
            });

            it('keeps the first player token when you would pass it', function() {
                expect(this.player1.player.firstPlayer).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.unicorn);
                this.player1.clickCard(this.unicorn);
                expect(this.getChatLogs(1)).toContain('player1 plays Way of the Unicorn to keep the first player token');
                expect(this.player1.player.firstPlayer).toBe(true);
                expect(this.player2.player.firstPlayer).toBe(false);
                expect(this.player1).toHavePromptButton('End Round');
                expect(this.player2).toHavePrompt('Waiting for opponent to end the round');
            });
        });

        describe('in the second player\'s hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'fate',
                    player2: {
                        hand: ['way-of-the-unicorn']
                    }
                });
                this.unicorn = this.player2.findCardByName('way-of-the-unicorn');
            });

            it('is not offered when the opponent passes the first player token to you', function() {
                expect(this.player1.player.firstPlayer).toBe(true);
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.unicorn.location).toBe('hand');
                expect(this.player2.player.firstPlayer).toBe(true);
                expect(this.player1.player.firstPlayer).toBe(false);
                expect(this.player2).toHavePromptButton('End Round');
                expect(this.player1).toHavePrompt('Waiting for opponent to end the round');
            });
        });
    });
});
