describe('Hiruma Ambusher', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    rings: ['earth'],
                    inPlay: ['vanguard-warrior', 'ishiken-initiate', 'valiant-oathkeeper'],
                    hand: ['hiruma-ambusher']
                },
                player2: {
                    fate: 10,
                    inPlay: ['doji-whisperer'],
                    hand: ['hiruma-ambusher']
                }
            });
            this.vanguard = this.player1.findCardByName('vanguard-warrior');
            this.ishiken = this.player1.findCardByName('ishiken-initiate');
            this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
            this.p1Ambusher = this.player1.findCardByName('hiruma-ambusher');
            this.ambusher = this.player2.findCardByName('hiruma-ambusher');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.vanguard, this.ishiken],
                defenders: []
            });
        });

        it('after it enters play as a defender, stops the chosen character\'s action abilities from being triggered this conflict (ruling #150)', function() {
            this.player2.playCharacterFromHand(this.ambusher);
            this.player2.clickPrompt('Conflict');
            expect(this.ambusher.isDefending()).toBe(true);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.ambusher);
            this.player2.clickCard(this.ambusher);
            expect(this.player2).toBeAbleToSelect(this.vanguard);
            expect(this.player2).toBeAbleToSelect(this.oathkeeper);
            this.player2.clickCard(this.vanguard);
            expect(this.getChatLogs(5)).toContain('player2 uses Hiruma Ambusher to prevent Vanguard Warrior from using any abilities');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.vanguard);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1).not.toHavePrompt('Vanguard Warrior');
            expect(this.vanguard.location).toBe('play area');
        });

        it('does not stop the chosen character\'s constant abilities (ruling #150)', function() {
            expect(this.ishiken.militarySkill).toBe(2);
            this.player2.playCharacterFromHand(this.ambusher);
            this.player2.clickPrompt('Conflict');
            this.player2.clickCard(this.ambusher);
            this.player2.clickCard(this.ishiken);
            expect(this.getChatLogs(5)).toContain('player2 uses Hiruma Ambusher to prevent Ishiken Initiate from using any abilities');
            expect(this.ishiken.militarySkill).toBe(2);
            expect(this.ishiken.politicalSkill).toBe(2);
        });

        it('does not trigger when it is played at home', function() {
            this.player2.playCharacterFromHand(this.ambusher);
            this.player2.clickPrompt('Home');
            expect(this.ambusher.location).toBe('play area');
            expect(this.ambusher.isParticipating()).toBe(false);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('does not trigger when it enters play as an attacker', function() {
            this.player2.pass();
            this.player1.playCharacterFromHand(this.p1Ambusher);
            this.player1.clickPrompt('Conflict');
            expect(this.p1Ambusher.isAttacking()).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
