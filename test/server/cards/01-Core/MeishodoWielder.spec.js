describe('Meishōdō Wielder', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 10,
                    dynastyDiscard: ['meishodo-wielder']
                },
                player2: {
                    fate: 10,
                    dynastyDiscard: ['meishodo-wielder']
                }
            });
            this.wielder = this.player1.placeCardInProvince('meishodo-wielder', 'province 1');
            this.p2Wielder = this.player2.placeCardInProvince('meishodo-wielder', 'province 1');
        });

        it('costs 1 less to play while you are the first player', function() {
            expect(this.game.getFirstPlayer()).toBe(this.player1.player);
            this.player1.clickCard(this.wielder);
            this.player1.clickPrompt('0');
            expect(this.wielder.location).toBe('play area');
            expect(this.player1.fate).toBe(9);
        });

        it('costs its full cost to play while you are not the first player', function() {
            this.player1.clickPrompt('Pass');
            expect(this.player2).toHavePrompt('Play cards from provinces');
            this.player2.clickCard(this.p2Wielder);
            this.player2.clickPrompt('0');
            expect(this.p2Wielder.location).toBe('play area');
            expect(this.player2.fate).toBe(8);
        });
    });
});
