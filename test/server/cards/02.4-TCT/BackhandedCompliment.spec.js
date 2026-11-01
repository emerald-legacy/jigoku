describe('Backhanded Compliment', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    hand: ['backhanded-compliment']
                },
                player2: {
                    honor: 10
                }
            });
            this.compliment = this.player1.findCardByName('backhanded-compliment');
            this.player1.reduceDeckToNumber('conflict deck', 5);
            this.player2.reduceDeckToNumber('conflict deck', 5);
        });

        it('makes the chosen opponent draw 1 card and lose 1 honor', function() {
            this.player1.clickCard(this.compliment);
            expect(this.player1).toHavePromptButton('player1');
            expect(this.player1).toHavePromptButton('player2');
            this.player1.clickPrompt('player2');
            expect(this.player2.honor).toBe(9);
            expect(this.player2.hand.length).toBe(1);
            expect(this.player2.conflictDeck.length).toBe(4);
            expect(this.player1.honor).toBe(10);
            expect(this.player1.conflictDeck.length).toBe(5);
            expect(this.getChatLogs(5)).toContain('player1 plays Backhanded Compliment to make player2 lose an honor and draw a card');
        });

        it('makes yourself draw 1 card and lose 1 honor when you choose yourself', function() {
            this.player1.clickCard(this.compliment);
            this.player1.clickPrompt('player1');
            expect(this.player1.honor).toBe(9);
            expect(this.player1.hand.length).toBe(1);
            expect(this.player1.conflictDeck.length).toBe(4);
            expect(this.player2.honor).toBe(10);
            expect(this.player2.hand.length).toBe(0);
            expect(this.getChatLogs(5)).toContain('player1 plays Backhanded Compliment to make player1 lose an honor and draw a card');
        });
    });
});
