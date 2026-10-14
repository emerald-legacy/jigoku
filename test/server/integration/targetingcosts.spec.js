describe('Costs to target', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'adept-of-the-waves'],
                    hand: ['to-show-the-path', 'forged-edict']
                },
                player2: {
                    fate: 7,
                    inPlay: ['doji-challenger'],
                    hand: ['assassination']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.player1.clickCard('to-show-the-path');
            this.player1.clickCard(this.whisperer);
            this.noMoreActions();
            this.initiateConflict({ attackers: ['adept-of-the-waves'], defenders: [] });
        });

        it('are paid after the ability\'s line', function () {
            this.player2.clickCard('assassination');
            this.player2.clickCard(this.whisperer);
            this.player1.clickPrompt('Pass');

            expect(this.whisperer.location).toBe('dynasty discard pile');
            expect(this.player2.fate).toBe(6);
            const chat = this.getChatLogs(5);
            const played = chat.indexOf('player2 plays Assassination, losing 3 honor to discard Doji Whisperer');
            expect(played).toBeGreaterThan(-1);
            expect(chat.indexOf('player2 pays 1 fate in order to target Doji Whisperer')).toBe(played + 1);
        });

        it('are paid even when the effects are cancelled', function () {
            this.player2.clickCard('assassination');
            this.player2.clickCard(this.whisperer);
            this.player1.clickCard('forged-edict');
            this.player1.clickCard(this.whisperer);

            expect(this.whisperer.location).toBe('play area');
            expect(this.player2.fate).toBe(6);
            expect(this.getChatLogs(5)).toContain('player2 pays 1 fate in order to target Doji Whisperer');
        });
    });
});
