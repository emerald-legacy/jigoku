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

describe('Summary of a hidden province during setup', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('phoenix', [
                'isawa-mori-seido',
                'entrenched-position', 'fertile-fields', 'shameful-display', 'elemental-fury', 'meditations-on-the-tao',
                'otomo-courtier', 'otomo-courtier', 'otomo-courtier', 'otomo-courtier', 'otomo-courtier',
                'banzai', 'banzai', 'banzai', 'banzai', 'banzai'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.player1.player.provinceDeck[0]);
        });

        it('does not carry the province strength to the opponent', function() {
            expect(this.player1).toHavePrompt('Choose province order, or press Done to place them at random');
            const provinceDeck = this.game.getState('player2').players.player1.cardPiles.provinceDeck;
            expect(provinceDeck.length).toBe(5);
            for(const summary of provinceDeck) {
                expect(summary.facedown).toBe(true);
                expect(summary.strengthSummary).toEqual({});
            }
        });
    });
});
