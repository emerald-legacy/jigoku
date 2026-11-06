describe('Shinjo Scout', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 5,
                    inPlay: ['shinjo-scout'],
                    dynastyDeck: ['doji-whisperer']
                },
                player2: {
                    fate: 5
                }
            });
            this.shinjoScout = this.player1.findCardByName('shinjo-scout');
            this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 1');
        });

        it('gains 1 extra fate after you pass first in the dynasty phase', function() {
            this.player1.pass();
            expect(this.player1.fate).toBe(6);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.shinjoScout);
            this.player1.clickCard(this.shinjoScout);
            expect(this.player1.fate).toBe(7);
            expect(this.getChatLogs(5)).toContain('player1 uses Shinjo Scout to gain 1 fate');
        });

        it('does not trigger when you pass second and gain no fate for passing', function() {
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('0');
            this.player2.pass();
            expect(this.player2.fate).toBe(6);
            expect(this.player1.fate).toBe(4);
            this.player1.pass();
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.fate).toBe(4);
            expect(this.game.currentPhase).not.toBe('dynasty');
        });
    });
});
