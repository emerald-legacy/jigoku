describe('copied duel abilities', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-actor']
                },
                player2: {
                    inPlay: ['prudent-challenger', 'doji-whisperer']
                }
            });
            this.actor = this.player1.findCardByName('shosuro-actor');
            this.prudentChallenger = this.player2.findCardByName('prudent-challenger');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('checks the copy\'s own challenger, not the original card', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.actor],
                defenders: [this.whisperer],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.actor);
            this.player1.clickCard(this.prudentChallenger);
            this.player2.pass();

            this.player1.clickCard(this.actor);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
        });
    });
});
