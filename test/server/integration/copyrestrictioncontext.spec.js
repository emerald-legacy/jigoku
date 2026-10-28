describe('A copy of a card with a restriction', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-actor'],
                    hand: ['admit-defeat']
                },
                player2: {
                    inPlay: ['borderlands-defender']
                }
            });
            this.actor = this.player1.findCardByName('shosuro-actor');
            this.admitDefeat = this.player1.findCardByName('admit-defeat');
            this.defender = this.player2.findCardByName('borderlands-defender');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.actor],
                defenders: [this.defender]
            });
            this.player2.pass();
            this.player1.clickCard(this.actor);
            this.player1.clickCard(this.defender);
        });

        it('leaves the original\'s restriction with the original\'s controller', function() {
            expect(this.actor.name).toBe('Borderlands Defender');
            this.player2.pass();
            this.player1.clickCard(this.admitDefeat);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.defender.bowed).toBe(false);
            expect(this.admitDefeat.location).toBe('hand');
        });
    });
});
