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

        it('shares the piles that did not change with the previous entry', function() {
            this.game.recordHiddenInfo();
            this.player1.moveCard('banzai', 'conflict discard pile');
            this.game.recordHiddenInfo();

            const [first, second] = this.game.hiddenInfoLog.map((entry) => entry.info);
            expect(second.player1.hand).not.toBe(first.player1.hand);
            expect(second.player1.provinces.one).toBe(first.player1.provinces.one);
            expect(second.player2.hand).toBe(first.player2.hand);
            expect(JSON.parse(JSON.stringify(second))).toEqual(JSON.parse(JSON.stringify(this.game.serializer.getHiddenInfo())));
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
