describe('Playing a character', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['isawa-skycaller'],
                    dynastyDiscard: ['bake-kujira']
                }
            });
            this.skycaller = this.player1.findCardByName('isawa-skycaller');
            this.kujira = this.player1.placeCardInProvince('bake-kujira', 'province 1');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.skycaller],
                defenders: [],
                ring: 'air'
            });
            this.player2.pass();
        });

        it('keeps its legendary fate when played into the conflict', function() {
            this.player1.clickCard(this.kujira);
            this.player1.clickPrompt('0');
            expect(this.game.currentConflict.attackers).toContain(this.kujira);
            expect(this.kujira.fate).toBe(1);
        });
    });
});
