describe('Summary of a card hidden from the viewer', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['banzai']
                }
            });
        });

        it('is the hidden form plus the card back, without the in-play fields', function() {
            const summary = this.game.getState('player2').players.player1.cardPiles.hand[0];
            expect(Object.keys(summary).sort()).toEqual([
                'controller', 'facedown', 'inConflict', 'isConflict', 'isDynasty', 'location', 'menu',
                'selectable', 'selected', 'unselectable', 'uuid'
            ]);
            expect(summary.facedown).toBe(true);
            expect(summary.isConflict).toBe(true);
            expect(summary.uuid).toBeUndefined();
        });
    });
});
