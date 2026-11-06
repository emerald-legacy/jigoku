describe('Levy', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    honor: 10,
                    hand: ['levy']
                },
                player2: {
                    fate: 5,
                    honor: 10
                }
            });
            this.levy = this.player1.findCardByName('levy');
        });

        it('makes the opponent choose between giving you 1 fate or 1 honor', function() {
            this.player1.clickCard(this.levy);
            expect(this.player2).toHavePromptButton('Give your opponent 1 fate');
            expect(this.player2).toHavePromptButton('Give your opponent 1 honor');
            expect(this.player1).not.toHavePromptButton('Give your opponent 1 fate');
        });

        it('takes 1 fate from the opponent when they choose fate', function() {
            this.player1.clickCard(this.levy);
            this.player2.clickPrompt('Give your opponent 1 fate');
            expect(this.player1.fate).toBe(6);
            expect(this.player2.fate).toBe(4);
            expect(this.player1.honor).toBe(10);
            expect(this.player2.honor).toBe(10);
            expect(this.levy.location).toBe('conflict discard pile');
        });

        it('takes 1 honor from the opponent when they choose honor', function() {
            this.player1.clickCard(this.levy);
            this.player2.clickPrompt('Give your opponent 1 honor');
            expect(this.player1.honor).toBe(11);
            expect(this.player2.honor).toBe(9);
            expect(this.player1.fate).toBe(5);
            expect(this.player2.fate).toBe(5);
        });

        it('does not offer giving fate to an opponent with no fate (ruling #73)', function() {
            this.player2.fate = 0;
            this.player1.clickCard(this.levy);
            expect(this.player2).not.toHavePromptButton('Give your opponent 1 fate');
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.player1.honor).toBe(11);
            expect(this.player2.honor).toBe(9);
            expect(this.player1.fate).toBe(5);
            expect(this.player2.fate).toBe(0);
            expect(this.levy.location).toBe('conflict discard pile');
        });
    });
});
