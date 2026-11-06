describe('Hida Tomonatsu', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['valiant-oathkeeper', 'kakita-asami', 'doji-whisperer', 'hida-tomonatsu']
                },
                player2: {
                    inPlay: ['hida-tomonatsu', 'samurai-of-integrity', 'serene-warrior']
                }
            });
            this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
            this.asami = this.player1.findCardByName('kakita-asami');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.p1Tomonatsu = this.player1.findCardByName('hida-tomonatsu');
            this.tomonatsu = this.player2.findCardByName('hida-tomonatsu');
            this.samurai = this.player2.findCardByName('samurai-of-integrity');
            this.sereneWarrior = this.player2.findCardByName('serene-warrior');
            this.noMoreActions();
        });

        it('after it wins a conflict as a defender, sacrifices itself to return a non-unique attacker to the top of its owner\'s deck', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.oathkeeper, this.asami],
                defenders: [this.tomonatsu, this.samurai]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player2 won a military conflict 6 vs 3');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.tomonatsu);
            this.player2.clickCard(this.tomonatsu);
            this.player2.clickCard(this.oathkeeper);
            expect(this.tomonatsu.location).toBe('dynasty discard pile');
            expect(this.oathkeeper.location).toBe('dynasty deck');
            expect(this.player1.player.dynastyDeck[0]).toBe(this.oathkeeper);
        });

        it('can only choose a non-unique attacking character', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.oathkeeper, this.asami],
                defenders: [this.tomonatsu, this.samurai]
            });
            this.noMoreActions();
            this.player2.clickCard(this.tomonatsu);
            expect(this.player2).toHavePrompt('Hida Tomonatsu');
            expect(this.player2).toBeAbleToSelect(this.oathkeeper);
            expect(this.player2).not.toBeAbleToSelect(this.asami);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);
            expect(this.player2).not.toBeAbleToSelect(this.samurai);
        });

        it('does not trigger when it loses a conflict as a defender', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.oathkeeper, this.asami, this.p1Tomonatsu],
                defenders: [this.tomonatsu]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 6 vs 3');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.tomonatsu.location).toBe('play area');
        });

        it('does not trigger when its controller wins a conflict as the defender without it', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.oathkeeper, this.asami],
                defenders: [this.samurai, this.sereneWarrior]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player2 won a military conflict 6 vs 3');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.tomonatsu.location).toBe('play area');
            expect(this.oathkeeper.location).toBe('play area');
        });

        it('does not trigger when it wins a conflict as an attacker', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.tomonatsu, this.samurai],
                defenders: [this.oathkeeper]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player2 won a military conflict 6 vs 2');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.tomonatsu.location).toBe('play area');
            expect(this.oathkeeper.location).toBe('play area');
        });
    });
});
