describe('Manually moving a card out of a deck', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['banzai'],
                    dynastyDiscard: ['doji-whisperer']
                }
            });
            this.banzai = this.player1.findCardByName('banzai');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.player1.moveCard(this.banzai, 'conflict deck');
            this.player1.moveCard(this.whisperer, 'dynasty deck');
            this.game.manualMode = true;
        });

        it('does not name the card when it goes from the conflict deck to the hand', function() {
            this.game.drop('player1', this.banzai.uuid, 'conflict deck', 'hand');
            expect(this.banzai.location).toBe('hand');
            expect(this.getChatLogs(3)).toContain('player1 manually moves a card from their conflict deck to their hand');
        });

        it('does not name the card when it goes from the dynasty deck to a province', function() {
            this.game.drop('player1', this.whisperer.uuid, 'dynasty deck', 'province 1');
            expect(this.whisperer.location).toBe('province 1');
            expect(this.getChatLogs(3)).toContain('player1 manually moves a card from their dynasty deck to their province 1');
        });

        it('names the card when it goes from the deck to a revealing pile', function() {
            this.game.drop('player1', this.banzai.uuid, 'conflict deck', 'conflict discard pile');
            expect(this.banzai.location).toBe('conflict discard pile');
            expect(this.getChatLogs(3)).toContain('player1 manually moves Banzai! from their conflict deck to their conflict discard pile');
        });
    });
});
