describe('Doomed Shugenja', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 10,
                    dynastyDiscard: ['doomed-shugenja', 'doomed-shugenja', 'doji-whisperer']
                }
            });
            const doomed = this.player1.filterCardsByName('doomed-shugenja');
            this.doomed1 = this.player1.placeCardInProvince(doomed[0], 'province 1');
            this.doomed2 = this.player1.placeCardInProvince(doomed[1], 'province 2');
            this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 3');
        });

        it('cannot have fate placed on it when played from a province', function() {
            this.player1.clickCard(this.doomed1);
            expect(this.player1).toHavePrompt('Choose additional fate');
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).not.toHavePromptButton('1');
            this.player1.clickPrompt('0');
            expect(this.doomed1.location).toBe('play area');
            expect(this.doomed1.fate).toBe(0);
            expect(this.player1.fate).toBe(9);
        });

        it('is Limited: a second copy cannot be played in the same round', function() {
            this.player1.clickCard(this.doomed1);
            this.player1.clickPrompt('0');
            expect(this.doomed1.location).toBe('play area');
            this.player2.pass();
            expect(this.player1).toHavePrompt('Click pass when done');
            this.player1.clickCard(this.doomed2);
            expect(this.doomed2.location).toBe('province 2');
            expect(this.player1).toHavePrompt('Click pass when done');
            this.player1.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Choose additional fate');
        });
    });
});
