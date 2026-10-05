describe('showing the top card of a conflict deck', function () {
    integration(function () {
        describe('when the viewer\'s own conflict deck is empty', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDeck: ['artisan-academy']
                    }
                });
                this.artisanAcademy = this.player1.placeCardInProvince('artisan-academy', 'province 1');
                this.player2.player.conflictDeck = [];
            });

            it('still shows the owner\'s top card to the opponent', function () {
                this.player1.clickCard(this.artisanAcademy);
                expect(this.player1.player.conflictDeck.length).toBeGreaterThan(0);
                expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(true);
            });
        });

        describe('when the owner\'s conflict deck is empty', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDeck: ['artisan-academy']
                    }
                });
                this.artisanAcademy = this.player1.placeCardInProvince('artisan-academy', 'province 1');
            });

            it('shows no top card to anyone', function () {
                this.player1.clickCard(this.artisanAcademy);
                this.player1.player.conflictDeck = [];
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(false);
                expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(false);
            });
        });
    });
});
