describe('Yasuki Yoshi', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['yasuki-yoshi', 'doji-whisperer', 'shinjo-outrider'],
                    hand: ['no-breath-wasted']
                },
                player2: {
                    honor: 10,
                    inPlay: ['kitsuki-shomon', 'doji-challenger']
                }
            });
            this.yoshi = this.player1.findCardByName('yasuki-yoshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.noBreathWasted = this.player1.findCardByName('no-breath-wasted');
            this.shomon = this.player2.findCardByName('kitsuki-shomon');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('makes the losing player lose 1 honor after it wins a conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.yoshi],
                defenders: [this.shomon]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 4 vs 3');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.yoshi);

            expect(this.player2.honor).toBe(9);
            expect(this.player1.honor).toBe(10);
            expect(this.getChatLogs(3)).toContain('player1 uses Yasuki Yoshi to make player2 lose 1 honor');
        });

        it('triggers again in a second conflict of the round', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.yoshi],
                defenders: [this.shomon]
            });
            this.noMoreActions();
            this.player1.clickCard(this.yoshi);
            expect(this.player2.honor).toBe(9);
            this.player1.clickPrompt('Gain 2 Honor');

            this.player1.clickCard(this.noBreathWasted);
            this.player1.clickCard(this.yoshi);
            this.player1.clickCard(this.whisperer);
            expect(this.yoshi.bowed).toBe(false);
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                ring: 'fire',
                attackers: [this.challenger],
                defenders: [this.yoshi]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 4 vs 3');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.yoshi);

            expect(this.player2.honor).toBe(8);
        });

        it('does not trigger when it did not take part in the win', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.outrider],
                defenders: []
            });
            this.noMoreActions();

            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 2 vs 0');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
