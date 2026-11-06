describe('Replay hidden-info log', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['banzai', 'fine-katana']
                }
            });
        });

        it('numbers every state and logs the hidden cards only when they change', function() {
            expect(this.game.recordHiddenInfo()).toBe(1);
            expect(this.game.recordHiddenInfo()).toBe(2);
            expect(this.game.hiddenInfoLog.length).toBe(1);
            expect(this.game.hiddenInfoLog[0].seq).toBe(1);
            expect(this.game.hiddenInfoLog[0].info.player1.hand.map((card) => card.id)).toEqual(['banzai', 'fine-katana']);

            this.player1.moveCard('banzai', 'conflict discard pile');

            expect(this.game.recordHiddenInfo()).toBe(3);
            expect(this.game.hiddenInfoLog.length).toBe(2);
            expect(this.game.hiddenInfoLog[1].seq).toBe(3);
            expect(this.game.hiddenInfoLog[1].info.player1.hand.map((card) => card.id)).toEqual(['fine-katana']);
        });

        it('ends with the winning state', function() {
            expect(this.game.recordHiddenInfo()).toBe(1);
            this.game.recordWinner(this.player1.player, 'honor');
            this.player1.moveCard('banzai', 'conflict discard pile');

            expect(this.game.recordHiddenInfo()).toBe(2);
            expect(this.game.hiddenInfoLog.map((entry) => entry.seq)).toEqual([1, 2]);

            this.player1.moveCard('fine-katana', 'conflict discard pile');

            expect(this.game.recordHiddenInfo()).toBeUndefined();
            expect(this.game.hiddenInfoLog.length).toBe(2);
        });
    });
});
