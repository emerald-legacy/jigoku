describe('Nightingale Tattoo', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-initiate'],
                    hand: ['nightingale-tattoo'],
                    conflictDiscard: ['centipede-tattoo', 'hurricane-punch', 'fine-katana']
                },
                player2: {}
            });
            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.centipede = this.player1.findCardByName('centipede-tattoo', 'conflict discard pile');
            this.punch = this.player1.findCardByName('hurricane-punch', 'conflict discard pile');
            this.katana = this.player1.findCardByName('fine-katana', 'conflict discard pile');

            this.nightingale = this.player1.playAttachment('nightingale-tattoo', this.initiate);
            this.player2.pass();
        });

        it('gives the attached character the Tattooed trait', function () {
            expect(this.initiate.hasTrait('tattooed')).toBe(true);
        });

        it('lets the player choose 2 Tattoo or Kihō cards in their conflict discard pile', function () {
            this.player1.clickCard(this.nightingale);
            expect(this.player1).toBeAbleToSelect(this.centipede);
            expect(this.player1).toBeAbleToSelect(this.punch);
            expect(this.player1).not.toBeAbleToSelect(this.katana);
        });

        it('lets the opponent shuffle one into the deck and removes the other from the game', function () {
            this.player1.clickCard(this.nightingale);
            this.player1.clickCard(this.centipede);
            this.player1.clickCard(this.punch);
            this.player1.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Choose a card to shuffle into your opponent\'s deck');
            const button = this.player2.currentPrompt().buttons.find((button) => button.text === 'Hurricane Punch');
            this.player2.clickPrompt(button.text);

            expect(this.punch.location).toBe('conflict deck');
            expect(this.centipede.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain(
                'player2 chooses Hurricane Punch to be shuffled into player1\'s deck. Centipede Tattoo is removed from the game'
            );
        });
    });
});
