describe('a menu prompt', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-s-whisperers']
                },
                player2: {
                    hand: ['assassination', 'fine-katana']
                }
            });
            this.whisperers = this.player1.findCardByName('bayushi-s-whisperers');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperers],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.whisperers);
            this.whisperers.bowed = false;

            this.control = this.player1.player.currentPrompt().controls.find((control) => control.name === 'card-name');
        });

        it('ignores a method none of its buttons or controls sends', function() {
            this.game.menuButton(this.player1.player.name, null, this.control.uuid, 'bow');
            this.game.continue();

            expect(this.whisperers.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Name a card');
        });

        it('still takes the method its control sends', function() {
            this.player1.chooseCardInPrompt('Assassination', 'card-name');

            expect(this.player1).not.toHavePrompt('Name a card');
        });
    });
});
