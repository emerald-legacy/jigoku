describe('Vengeful Oathkeeper', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'kakita-asami', 'hida-kisada']
                },
                player2: {
                    inPlay: ['doji-challenger', 'doji-whisperer'],
                    hand: ['vengeful-oathkeeper']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.asami = this.player1.findCardByName('kakita-asami');
            this.kisada = this.player1.findCardByName('hida-kisada');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.oathkeeper = this.player2.findCardByName('vengeful-oathkeeper');
        });

        // ruling #119: it enters play at home, not in the conflict
        it('puts itself into play at home from hand after you lose a military conflict', function() {
            const fate = this.player2.fate;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kisada],
                defenders: [this.challenger]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 7 vs 3');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.oathkeeper);
            this.player2.clickCard(this.oathkeeper);
            expect(this.getChatLogs(5)).toContain('player2 uses Vengeful Oathkeeper to put Vengeful Oathkeeper into play');
            expect(this.oathkeeper.location).toBe('play area');
            expect(this.oathkeeper.isParticipating()).toBe(false);
            expect(this.oathkeeper.fate).toBe(0);
            expect(this.player2.fate).toBe(fate);
        });

        it('also triggers when you lose a military conflict as the attacker', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.kisada]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 7 vs 3');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.oathkeeper);
            expect(this.oathkeeper.location).toBe('play area');
            expect(this.oathkeeper.isParticipating()).toBe(false);
        });

        it('does not trigger when you lose a political conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.asami],
                defenders: [this.whisperer]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 3 vs 3');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.oathkeeper.location).toBe('hand');
        });

        it('does not trigger when you win a military conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.challenger]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 3 vs 2');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.oathkeeper.location).toBe('hand');
        });
    });
});
