describe('Bird-Helm Adjudicator', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['bird-helm-adjudicator']
                },
                player2: {
                    honor: 10,
                    inPlay: ['doji-whisperer']
                }
            });
            this.adjudicator = this.player1.findCardByName('bird-helm-adjudicator');
        });

        it('should take 1 honor after you pass on declaring a conflict', function() {
            this.noMoreActions();
            this.player1.passConflict();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.adjudicator);
            this.player1.clickCard(this.adjudicator);
            expect(this.player1.honor).toBe(11);
            expect(this.player2.honor).toBe(9);
        });

        it('should not trigger after the opponent passes', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.player1.clickPrompt('Pass');
            this.noMoreActions();
            this.player2.passConflict();
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.getChatLogs(5)).toContain('player2 has chosen to pass their conflict opportunity');
            expect(this.player1.honor).toBe(10);
            expect(this.player2.honor).toBe(10);
        });

        it('should be limited to once per round', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.player1.clickCard(this.adjudicator);
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            this.player1.passConflict();
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.honor).toBe(11);
            expect(this.player2.honor).toBe(9);
        });
    });
});
