describe('keyword abilities', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['manipulative-scout', 'manipulative-scout', 'manipulative-scout'],
                    dynastyDiscard: ['open-window']
                }
            });
            this.scouts = this.player1.filterCardsByName('manipulative-scout');
            this.openWindow = this.player1.placeCardInProvince('open-window', 'province 1');
            this.openWindow.facedown = true;
        });

        it('resolve once per triggering condition, with no limit per round: Rally on each reveal', function() {
            const inProvince = () => this.player1.player.getDynastyCardsInProvince('province 1').length;
            const before = inProvince();

            this.player1.clickCard(this.scouts[0]);
            this.player1.clickCard(this.openWindow);
            expect(inProvince()).toBe(before + 1);

            this.player2.pass();
            this.player1.clickCard(this.scouts[1]);
            this.player1.clickCard(this.openWindow);
            expect(this.openWindow.facedown).toBe(true);

            this.player2.pass();
            this.player1.clickCard(this.scouts[2]);
            this.player1.clickCard(this.openWindow);
            expect(inProvince()).toBe(before + 2);
        });
    });
});
