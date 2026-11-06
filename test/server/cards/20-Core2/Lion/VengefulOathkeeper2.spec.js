describe('Vengeful Oathkeeper 2', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'kakita-asami', 'kakita-yoshi']
                },
                player2: {
                    inPlay: ['doji-challenger', 'doji-whisperer'],
                    hand: ['vengeful-oathkeeper-2']
                }
            });

            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.asami = this.player1.findCardByName('kakita-asami');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.oathkeeper = this.player2.findCardByName('vengeful-oathkeeper-2');
        });

        it('should put itself into play from hand after you lose a conflict as the defender', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.asami],
                defenders: []
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 3 vs 0');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.oathkeeper);
            this.player2.clickCard(this.oathkeeper);
            expect(this.oathkeeper.location).toBe('play area');
            expect(this.oathkeeper.isParticipating()).toBe(false);
        });

        it('should not trigger when you win a conflict as the defender', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brashSamurai],
                defenders: [this.challenger]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a political conflict 3 vs 1');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.oathkeeper.location).toBe('hand');
        });

        it('should not trigger when you lose a conflict as the attacker', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.challenger],
                defenders: [this.yoshi]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 6 vs 3');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.oathkeeper.location).toBe('hand');
        });
    });
});
