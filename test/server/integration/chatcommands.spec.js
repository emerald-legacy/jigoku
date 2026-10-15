describe('Chat commands', function() {
    integration(function() {
        describe('/move-to-bottom-deck', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['banzai']
                    }
                });
                this.banzai = this.player1.findCardByName('banzai');
            });

            it('should move the chosen card to the bottom of its deck and say which deck', function() {
                this.game.chat('player1', '/move-to-bottom-deck');
                this.game.continue();
                this.player1.clickCard(this.banzai);

                expect(this.banzai.location).toBe('conflict deck');
                expect(this.player1.conflictDeck[this.player1.conflictDeck.length - 1]).toBe(this.banzai);
                expect(this.getChatLogs(3)).toContain('player1 uses a command to move Banzai! from their hand to the bottom of their conflict deck.');
            });
        });
    });
});
