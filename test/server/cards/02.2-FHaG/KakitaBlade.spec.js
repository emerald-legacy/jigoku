describe('Kakita Blade', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['doji-whisperer'],
                    hand: ['kakita-blade', 'policy-debate', 'fine-katana', 'ornate-fan']
                },
                player2: {
                    honor: 10,
                    inPlay: ['doji-challenger'],
                    hand: ['banzai', 'assassination']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.policyDebate = this.player1.findCardByName('policy-debate');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.kakitaBlade = this.player1.playAttachment('kakita-blade', this.whisperer);
        });

        it('gives +2 military skill and no political skill outside a duel', function() {
            expect(this.whisperer.getMilitarySkill()).toBe(2);
            expect(this.whisperer.getPoliticalSkill()).toBe(3);
        });

        it('gives +2 political skill while the character is in a duel and gains 1 honor when it wins', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: [this.challenger]
            });
            this.player2.pass();
            this.player1.clickCard(this.policyDebate);
            this.player1.clickCard(this.whisperer);
            this.player1.clickCard(this.challenger);
            expect(this.whisperer.getPoliticalSkill()).toBe(5);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.getChatLogs(5)).toContain('Doji Whisperer: 6 vs 4: Doji Challenger');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.kakitaBlade);
            this.player1.clickCard(this.kakitaBlade);
            expect(this.getChatLogs(5)).toContain('player1 uses Kakita Blade to gain 1 honor');
            expect(this.player1.honor).toBe(11);
            this.player1.clickPrompt('Assassination');
            expect(this.player2.findCardByName('assassination').location).toBe('conflict discard pile');
            expect(this.whisperer.getPoliticalSkill()).toBe(3);
        });

        it('does not gain honor when the character loses the duel', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: [this.challenger]
            });
            this.player2.pass();
            this.player1.clickCard(this.policyDebate);
            this.player1.clickCard(this.whisperer);
            this.player1.clickCard(this.challenger);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('5');
            expect(this.getChatLogs(5)).toContain('Doji Whisperer: 6 vs 8: Doji Challenger');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose a card to discard');
            expect(this.player1.honor).toBe(14);
        });

        it('is Restricted', function() {
            this.player2.pass();
            this.player1.playAttachment('fine-katana', this.whisperer);
            this.player2.pass();
            this.player1.clickCard('ornate-fan');
            this.player1.clickCard(this.whisperer);
            expect(this.kakitaBlade.hasKeyword('Restricted')).toBe(true);
            expect(this.player1).toHavePrompt('Choose an attachment to discard');
            expect(this.player1).toBeAbleToSelect(this.kakitaBlade);
        });
    });
});
