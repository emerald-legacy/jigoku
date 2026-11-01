describe('Isawa Atsuko', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['isawa-atsuko', 'valiant-oathkeeper', 'samurai-of-integrity'],
                    hand: ['ishiken-initiate']
                },
                player2: {
                    inPlay: ['attendant-to-the-emperor', 'doji-whisperer']
                }
            });
            this.atsuko = this.player1.findCardByName('isawa-atsuko');
            this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
            this.samurai = this.player1.findCardByName('samurai-of-integrity');
            this.ishiken = this.player1.findCardByName('ishiken-initiate');
            this.attendant = this.player2.findCardByName('attendant-to-the-emperor');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.noMoreActions();
        });

        it('during a Void conflict gives your participating characters +1/+1 and the opponent\'s participating characters -1/-1', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'void',
                attackers: [this.oathkeeper],
                defenders: [this.attendant]
            });
            this.player2.pass();
            this.player1.clickCard(this.atsuko);
            expect(this.getChatLogs(5)).toContain('player1 uses Isawa Atsuko to give friendly characters +1/+1 and opposing characters -1/-1');
            expect(this.oathkeeper.militarySkill).toBe(3);
            expect(this.oathkeeper.politicalSkill).toBe(3);
            expect(this.attendant.militarySkill).toBe(0);
            expect(this.attendant.politicalSkill).toBe(4);
            expect(this.atsuko.militarySkill).toBe(3);
            expect(this.atsuko.politicalSkill).toBe(3);
            expect(this.samurai.politicalSkill).toBe(3);
            expect(this.whisperer.politicalSkill).toBe(3);
        });

        it('cannot be used during a conflict of another element', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'earth',
                attackers: [this.oathkeeper],
                defenders: [this.attendant]
            });
            this.player2.pass();
            this.player1.clickCard(this.atsuko);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.oathkeeper.politicalSkill).toBe(2);
            expect(this.attendant.politicalSkill).toBe(5);
        });

        it('does not affect a character that joins the conflict after it resolved (ruling #59)', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'void',
                attackers: [this.oathkeeper],
                defenders: [this.attendant]
            });
            this.player2.pass();
            this.player1.clickCard(this.atsuko);
            expect(this.oathkeeper.politicalSkill).toBe(3);
            this.player2.pass();
            this.player1.playCharacterFromHand(this.ishiken);
            this.player1.clickPrompt('Conflict');
            expect(this.ishiken.isAttacking()).toBe(true);
            expect(this.ishiken.militarySkill).toBe(1);
            expect(this.ishiken.politicalSkill).toBe(1);
        });
    });
});
