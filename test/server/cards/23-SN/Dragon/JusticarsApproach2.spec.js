describe('Justicar\'s Approach (evolved)', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bird-helm-adjudicator', 'matsu-berserker'],
                    hand: ['justicar-s-approach-evolved']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.adjudicator = this.player1.findCardByName('bird-helm-adjudicator');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.approach = this.player1.findCardByName('justicar-s-approach-evolved');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('should only attach to a Courtier or Magistrate character', function() {
            this.player1.clickCard(this.approach);
            expect(this.player1).toBeAbleToSelect(this.adjudicator);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.berserker);
        });

        describe('when attached', function() {
            beforeEach(function() {
                this.player1.playAttachment(this.approach, this.adjudicator);
                this.player2.pass();
            });

            it('should not be usable outside of a conflict', function() {
                this.player1.clickCard(this.adjudicator);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should dishonor the loser of the duel', function() {
                this.player1.clickPrompt('Pass');
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.adjudicator],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.adjudicator);
                this.player1.clickCard(this.whisperer);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.whisperer.isDishonored).toBe(true);
                expect(this.whisperer.bowed).toBe(false);
                expect(this.whisperer.location).toBe('play area');
            });

            it('should bow the loser if it is already dishonored', function() {
                this.whisperer.dishonor();
                this.player1.clickPrompt('Pass');
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.adjudicator],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.adjudicator);
                this.player1.clickCard(this.whisperer);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.whisperer.isDishonored).toBe(true);
                expect(this.whisperer.bowed).toBe(true);
                expect(this.whisperer.location).toBe('play area');
            });

            it('should discard the loser if it is already bowed and dishonored', function() {
                this.whisperer.dishonor();
                this.player1.clickPrompt('Pass');
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.adjudicator],
                    defenders: [this.whisperer]
                });
                this.whisperer.bowed = true;
                this.player2.pass();
                this.player1.clickCard(this.adjudicator);
                this.player1.clickCard(this.whisperer);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.whisperer.location).toBe('dynasty discard pile');
            });
        });
    });
});
