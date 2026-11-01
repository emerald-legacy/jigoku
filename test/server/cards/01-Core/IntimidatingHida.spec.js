describe('Intimidating Hida', function() {
    integration(function() {
        describe('controlled by the player who does not pass', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['valiant-oathkeeper']
                    },
                    player2: {
                        honor: 10,
                        inPlay: ['intimidating-hida']
                    }
                });
                this.hida = this.player2.findCardByName('intimidating-hida');
                this.noMoreActions();
            });

            it('makes the opponent lose 1 honor after they pass on declaring a conflict', function() {
                this.player1.passConflict();
                expect(this.getChatLogs(5)).toContain('player1 has chosen to pass their conflict opportunity');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.hida);
                this.player2.clickCard(this.hida);
                expect(this.player1.honor).toBe(9);
                expect(this.player2.honor).toBe(10);
            });
        });

        describe('controlled by the player who passes', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['intimidating-hida']
                    },
                    player2: {
                        honor: 10,
                        inPlay: ['valiant-oathkeeper']
                    }
                });
                this.hida = this.player1.findCardByName('intimidating-hida');
                this.noMoreActions();
            });

            it('does not trigger when you pass on declaring a conflict', function() {
                this.player1.passConflict();
                expect(this.getChatLogs(5)).toContain('player1 has chosen to pass their conflict opportunity');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player1.honor).toBe(10);
                expect(this.player2.honor).toBe(10);
            });
        });
    });
});
