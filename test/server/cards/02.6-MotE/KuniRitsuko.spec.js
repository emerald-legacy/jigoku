describe('Kuni Ritsuko', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'brash-samurai', fate: 2 }, { card: 'doji-whisperer', fate: 1 }, 'hida-kisada']
                },
                player2: {
                    inPlay: [{ card: 'kuni-ritsuko', fate: 1 }, { card: 'doji-challenger', fate: 1 }]
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.kisada = this.player1.findCardByName('hida-kisada');
            this.ritsuko = this.player2.findCardByName('kuni-ritsuko');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('removes 1 fate from an attacking character after it wins a conflict as a defender', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash, this.whisperer],
                defenders: [this.ritsuko, this.challenger]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 7 vs 2');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.ritsuko);
            expect(this.player2).toHavePrompt('Kuni Ritsuko');
            expect(this.player2).toBeAbleToSelect(this.brash);
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            expect(this.player2).not.toBeAbleToSelect(this.kisada);
            expect(this.player2).not.toBeAbleToSelect(this.ritsuko);
            expect(this.player2).not.toBeAbleToSelect(this.challenger);
            this.player2.clickCard(this.brash);
            expect(this.getChatLogs(5)).toContain('player2 uses Kuni Ritsuko to remove 1 fate from Brash Samurai');
            expect(this.brash.fate).toBe(1);
            expect(this.whisperer.fate).toBe(1);
        });

        it('does not trigger when it loses a conflict as a defender', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash, this.kisada],
                defenders: [this.ritsuko]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 9 vs 4');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.brash.fate).toBe(2);
        });

        it('does not trigger when its side wins as a defender without it', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.challenger]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 3 vs 2');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.brash.fate).toBe(2);
        });

        it('does not trigger when it wins a conflict as an attacker', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ritsuko],
                defenders: [this.brash]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 4 vs 2');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.brash.fate).toBe(2);
        });
    });
});
