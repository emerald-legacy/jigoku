describe('Matsu Beiona', function() {
    integration(function() {
        describe('with 3 other Bushi characters', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 10,
                        inPlay: ['valiant-oathkeeper', 'serene-warrior', 'samurai-of-integrity'],
                        dynastyDiscard: ['matsu-beiona']
                    }
                });
                this.beiona = this.player1.placeCardInProvince('matsu-beiona', 'province 1');
            });

            it('places 2 fate on itself after it enters play', function() {
                this.player1.clickCard(this.beiona);
                this.player1.clickPrompt('0');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.beiona);
                this.player1.clickCard(this.beiona);
                expect(this.beiona.location).toBe('play area');
                expect(this.beiona.fate).toBe(2);
                expect(this.player1.fate).toBe(7);
            });
        });

        describe('with only 2 other Bushi characters', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 10,
                        inPlay: ['valiant-oathkeeper', 'serene-warrior', 'doji-whisperer'],
                        dynastyDiscard: ['matsu-beiona']
                    },
                    player2: {
                        inPlay: ['samurai-of-integrity']
                    }
                });
                this.beiona = this.player1.placeCardInProvince('matsu-beiona', 'province 1');
            });

            it('does not trigger: neither itself nor the opponent\'s Bushi count', function() {
                this.player1.clickCard(this.beiona);
                this.player1.clickPrompt('0');
                expect(this.beiona.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Play cards from provinces');
                expect(this.beiona.fate).toBe(0);
                expect(this.player1.fate).toBe(7);
            });
        });
    });
});
