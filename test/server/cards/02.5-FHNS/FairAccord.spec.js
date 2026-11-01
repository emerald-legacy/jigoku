describe('Fair Accord', function() {
    integration(function() {
        describe('During the dynasty phase', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 3,
                        hand: ['fair-accord']
                    }
                });
                this.fairAccord = this.player1.findCardByName('fair-accord');
            });

            it('should discard the Imperial Favor to gain 2 fate', function() {
                this.player1.player.imperialFavor = 'military';
                this.player1.clickCard(this.fairAccord);
                expect(this.player1.player.imperialFavor).toBe('');
                expect(this.player1.fate).toBe(5);
                expect(this.fairAccord.location).toBe('conflict discard pile');
            });

            it('should not be playable without the Imperial Favor', function() {
                this.player2.player.imperialFavor = 'military';
                this.player1.clickCard(this.fairAccord);
                expect(this.fairAccord.location).toBe('hand');
                expect(this.player1.fate).toBe(3);
                expect(this.player2.player.imperialFavor).toBe('military');
            });
        });

        describe('During the conflict phase', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        hand: ['fair-accord']
                    }
                });
                this.fairAccord = this.player1.findCardByName('fair-accord');
            });

            it('should not be playable', function() {
                this.player1.player.imperialFavor = 'military';
                this.player1.clickCard(this.fairAccord);
                expect(this.fairAccord.location).toBe('hand');
                expect(this.player1.fate).toBe(3);
                expect(this.player1.player.imperialFavor).toBe('military');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
