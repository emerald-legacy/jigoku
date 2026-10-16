describe('Wolf\'s Proposal', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['brash-samurai'],
                    hand: ['wolf-s-proposal']
                },
                player2: {
                    inPlay: ['kakita-asami']
                }
            });

            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.wolfsProposal = this.player1.findCardByName('wolf-s-proposal');
            this.asami = this.player2.findCardByName('kakita-asami');

            this.player1.playAttachment(this.wolfsProposal, this.brashSamurai);
            this.player2.pass();
        });

        it('should give +1 military and +1 political', function() {
            expect(this.brashSamurai.getMilitarySkill()).toBe(3);
            expect(this.brashSamurai.getPoliticalSkill()).toBe(2);
            expect(this.brashSamurai.glory).toBe(2);
        });

        it('should increase the glory of the attached character by 2', function() {
            this.player1.clickCard(this.wolfsProposal);
            expect(this.player1).toHavePromptButton('Increase glory');
            expect(this.player1).toHavePromptButton('Decrease glory');
            this.player1.clickPrompt('Increase glory');
            expect(this.brashSamurai.glory).toBe(4);
            expect(this.asami.glory).toBe(2);
        });

        it('should only last for this phase', function() {
            this.brashSamurai.fate = 1;
            this.player1.clickCard(this.wolfsProposal);
            this.player1.clickPrompt('Decrease glory');
            expect(this.brashSamurai.glory).toBe(0);
            this.flow.finishConflictPhase();
            expect(this.game.currentPhase).toBe('fate');
            expect(this.brashSamurai.location).toBe('play area');
            expect(this.brashSamurai.glory).toBe(2);
        });

        it('should decrease the glory of the attached character by 2', function() {
            this.player1.clickCard(this.wolfsProposal);
            this.player1.clickPrompt('Decrease glory');
            expect(this.brashSamurai.glory).toBe(0);
        });

        it('should only be usable once per round', function() {
            this.player1.clickCard(this.wolfsProposal);
            this.player1.clickPrompt('Increase glory');
            this.player2.pass();
            this.player1.clickCard(this.wolfsProposal);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.brashSamurai.glory).toBe(4);
        });
    });
});
