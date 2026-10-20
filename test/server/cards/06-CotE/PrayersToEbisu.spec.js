describe('Prayers to Ebisu', function() {
    integration(function() {
        describe('Prayers to Ebisu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 5,
                        hand: ['prayers-to-ebisu']
                    },
                    player2: {
                        honor: 20
                    }
                });

                this.prayersToEbisu = this.player1.findCardByName('prayers-to-ebisu');
            });

            it('should make each player with 19 or more honor lose 4 honor', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.prayersToEbisu);
                expect(this.player2.honor).toBe(16);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should make each player with 6 or fewer honor gain 4 honor', function() {
                this.player1.clickCard(this.prayersToEbisu);
                expect(this.player1.honor).toBe(9);
            });

            it('should draw 1 card', function() {
                const handCount = this.player1.player.hand.length;
                this.player1.clickCard(this.prayersToEbisu);
                expect(this.prayersToEbisu.location).toBe('conflict discard pile');
                expect(this.player1.player.hand.length).toBe(handCount);
            });
        });
    });
});

describe('Prayers to Ebisu with an empty conflict deck', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 5,
                    hand: ['prayers-to-ebisu'],
                    conflictDiscard: ['fine-katana']
                },
                player2: {
                    honor: 10
                }
            });
            this.prayersToEbisu = this.player1.findCardByName('prayers-to-ebisu');
            this.player1.reduceDeckToNumber('conflict deck', 0);
        });

        it('loses the deck-out honor before gaining 4 honor (EmeraldDB ruling)', function() {
            this.player1.clickCard(this.prayersToEbisu);
            expect(this.player1.honor).toBe(0);
            expect(this.game.winner).toBe(this.player2.player);
        });

        it('gains 4 honor if the deck-out took the player to 6 or fewer', function() {
            this.player1.player.honor = 8;
            this.player1.clickCard(this.prayersToEbisu);
            expect(this.player1.honor).toBe(7);
            expect(this.game.winner).toBeUndefined();
        });
    });
});
