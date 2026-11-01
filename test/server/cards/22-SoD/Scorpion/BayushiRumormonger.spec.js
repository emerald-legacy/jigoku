describe('Bayushi Rumormonger', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-rumormonger', 'kakita-toshimoko']
                },
                player2: {
                    inPlay: ['keeper-initiate'],
                    hand: ['assassination', 'let-go', 'duelist-training']
                }
            });

            this.rumormonger = this.player1.findCardByName('bayushi-rumormonger');
            this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
            this.keeper = this.player2.findCardByName('keeper-initiate');
            this.assassination = this.player2.findCardByName('assassination');
            this.letGo = this.player2.findCardByName('let-go');
            this.training = this.player2.findCardByName('duelist-training');

            this.player2.player.moveCard(this.training, 'conflict deck');
            this.player2.player.moveCard(this.letGo, 'conflict deck');
            this.player2.player.moveCard(this.assassination, 'conflict deck');
        });

        it('discards the top cards of the opponent\'s conflict deck through a discard event', function () {
            const discarded = jasmine.createSpy('onCardsDiscarded');
            this.game.on('onCardsDiscarded', discarded);

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.rumormonger, this.toshimoko],
                defenders: [this.keeper]
            });
            this.player2.pass();
            this.player1.clickCard(this.rumormonger);

            expect(this.assassination.location).toBe('conflict discard pile');
            expect(this.letGo.location).toBe('conflict discard pile');
            expect(this.training.location).toBe('conflict deck');
            expect(discarded).toHaveBeenCalledTimes(1);
            expect(discarded).toHaveBeenCalledWith(jasmine.objectContaining({ cards: [this.assassination, this.letGo] }));
            expect(this.getChatLogs(5)).toContain('player1 uses Bayushi Rumormonger to discard 2 cards from player2\'s conflict deck');
        });
    });
});
