describe('Shiba Tsukune', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shiba-tsukune']
                },
                player2: {
                    inPlay: ['brash-samurai']
                }
            });

            this.tsukune = this.player1.findCardByName('shiba-tsukune');
            this.brash = this.player2.findCardByName('brash-samurai');

            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();

            this.tsukune.bow();
            this.brash.bow();
        });

        it('should trigger at the end of the conflict phase', function() {
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tsukune);
        });

        it('should resolve two unclaimed rings', function() {
            this.noMoreActions();
            this.player1.clickCard(this.tsukune);
            expect(this.player1).toHavePrompt('Choose a ring to resolve');
            this.player1.clickRing('fire');
            expect(this.player1).toHavePrompt('Choose a second ring to resolve, or click Done');
            expect(this.player1).not.toBeAbleToSelectRing('fire');
            expect(this.player1).toBeAbleToSelectRing('air');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickRing('air');
            expect(this.player1).toHavePrompt('Fire Ring');
            this.player1.clickCard(this.brash);
            this.player1.clickPrompt('Dishonor Brash Samurai');
            expect(this.player1).toHavePrompt('Air Ring');
            this.player1.clickPrompt('Gain 2 Honor');
            expect(this.brash.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 resolves Fire Ring and Air Ring');
        });

        it('should resolve only the first ring when Done is clicked', function() {
            this.noMoreActions();
            this.player1.clickCard(this.tsukune);
            this.player1.clickRing('fire');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Fire Ring');
            this.player1.clickCard(this.brash);
            this.player1.clickPrompt('Dishonor Brash Samurai');
            expect(this.brash.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 resolves Fire Ring');
        });

        it('should not prompt for a second ring when only one ring is unclaimed', function() {
            this.player1.claimRing('air');
            this.player1.claimRing('earth');
            this.player2.claimRing('void');
            this.player2.claimRing('water');
            this.noMoreActions();
            this.player1.clickCard(this.tsukune);
            expect(this.player1).toHavePrompt('Choose a ring to resolve');
            this.player1.clickRing('fire');
            expect(this.player1).toHavePrompt('Fire Ring');
            this.player1.clickCard(this.brash);
            this.player1.clickPrompt('Dishonor Brash Samurai');
            expect(this.brash.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 resolves Fire Ring');
        });
    });
});
