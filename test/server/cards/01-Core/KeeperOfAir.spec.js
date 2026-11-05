describe('Keeper of Air', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'seeker-of-knowledge']
                },
                player2: {
                    role: 'keeper-of-air',
                    fate: 5,
                    inPlay: ['bayushi-kachiko', 'otomo-courtier']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.seekerOfKnowledge = this.player1.findCardByName('seeker-of-knowledge');
            this.kachiko = this.player2.findCardByName('bayushi-kachiko');
            this.courtier = this.player2.findCardByName('otomo-courtier');
            this.keeper = this.player2.findCardByName('keeper-of-air');
            this.noMoreActions();
        });

        it('gains 1 fate after you win an Air conflict as the defending player', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                attackers: [this.whisperer],
                defenders: [this.kachiko]
            });
            this.noMoreActions();
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.keeper);
            this.player2.clickCard(this.keeper);
            expect(this.player2.fate).toBe(6);
        });

        it('does not trigger after you win a conflict of another element as the defending player', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'fire',
                attackers: [this.whisperer],
                defenders: [this.kachiko]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a political conflict 6 vs 3');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2.fate).toBe(5);
        });

        it('does not trigger after you lose an Air conflict as the defending player', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                attackers: [this.whisperer],
                defenders: [this.courtier]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 3 vs 2');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2.fate).toBe(5);
        });

        it('does not trigger after you win an Air conflict as the attacking player', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                attackers: [this.kachiko],
                defenders: []
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a political conflict 6 vs 0');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2.fate).toBe(5);
        });

        // ruling #147: a contested ring that gained Air from Seeker of Knowledge makes it an Air conflict
        it('triggers after you win a conflict whose ring gained Air', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'fire',
                attackers: [this.seekerOfKnowledge],
                defenders: [this.kachiko]
            });
            this.noMoreActions();
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.keeper);
            this.player2.clickCard(this.keeper);
            expect(this.player2.fate).toBe(6);
        });
    });
});
