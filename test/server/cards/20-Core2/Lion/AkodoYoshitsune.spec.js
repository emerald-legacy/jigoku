describe('Akodo Yoshitsune', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['akodo-yoshitsune', 'siege-captain']
                },
                player2: {
                    honor: 10,
                    inPlay: ['samurai-of-integrity', 'valiant-oathkeeper', 'goblin-brawler']
                }
            });
            this.yoshitsune = this.player1.findCardByName('akodo-yoshitsune');
            this.captain = this.player1.findCardByName('siege-captain');
            this.samurai = this.player2.findCardByName('samurai-of-integrity');
            this.oathkeeper = this.player2.findCardByName('valiant-oathkeeper');
            this.brawler = this.player2.findCardByName('goblin-brawler');
        });

        it('gains 1 honor after you win a conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                ring: 'earth',
                attackers: [this.yoshitsune],
                defenders: [this.samurai, this.oathkeeper]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 6 vs 5');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yoshitsune);
            this.player1.clickCard(this.yoshitsune);
            expect(this.player1.honor).toBe(11);
            expect(this.player2.honor).toBe(10);
            expect(this.getChatLogs(5)).toContain('player1 uses Akodo Yoshitsune to gain 1 honor');
        });

        it('does not trigger after you lose a conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                ring: 'earth',
                attackers: [this.captain],
                defenders: [this.brawler, this.oathkeeper]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player2 won a military conflict 6 vs 5');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.honor).toBe(10);
        });

        it('triggers when you win a conflict he is not participating in', function() {
            this.noMoreActions();
            this.initiateConflict({
                ring: 'earth',
                attackers: [this.captain],
                defenders: [this.samurai]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 5 vs 3');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yoshitsune);
            this.player1.clickCard(this.yoshitsune);
            expect(this.player1.honor).toBe(11);
        });

        it('can be used again after a second won conflict in the same round', function() {
            this.noMoreActions();
            this.initiateConflict({
                ring: 'earth',
                attackers: [this.yoshitsune],
                defenders: [this.samurai, this.oathkeeper]
            });
            this.noMoreActions();
            this.player1.clickCard(this.yoshitsune);
            expect(this.player1.honor).toBe(11);
            this.player1.clickPrompt('Draw a card and opponent discards');

            this.noMoreActions();
            this.initiateConflict({
                ring: 'water',
                attackers: [this.brawler],
                defenders: [this.captain]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 5 vs 4');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yoshitsune);
            this.player1.clickCard(this.yoshitsune);
            expect(this.player1.honor).toBe(12);
        });
    });
});
