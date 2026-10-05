describe('Bayushi Shinobu', function () {
    integration(function () {
        describe('when played from a province', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 30,
                        dynastyDiscard: ['bayushi-shinobu']
                    }
                });

                this.shinobu = this.player1.placeCardInProvince('bayushi-shinobu', 'province 1');
            });

            it('enters play dishonored', function () {
                let dishonoredOnEntering;
                this.game.on('onCharacterEntersPlay', (event) => {
                    if(event.card === this.shinobu) {
                        dishonoredOnEntering = this.shinobu.isDishonored;
                    }
                });

                this.player1.clickCard(this.shinobu);
                this.player1.clickPrompt('0');

                expect(this.shinobu.location).toBe('play area');
                expect(dishonoredOnEntering).toBe(true);
                expect(this.shinobu.isDishonored).toBe(true);
            });
        });

        describe('when put into play', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-manipulator'],
                        dynastyDiscard: ['bayushi-shinobu'],
                        hand: ['charge']
                    }
                });

                this.manipulator = this.player1.findCardByName('bayushi-manipulator');
                this.charge = this.player1.findCardByName('charge');
                this.shinobu = this.player1.placeCardInProvince('bayushi-shinobu', 'province 1');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.manipulator],
                    defenders: []
                });
                this.player2.pass();
            });

            it('enters play dishonored', function () {
                this.player1.clickCard(this.charge);
                this.player1.clickCard(this.shinobu);

                expect(this.shinobu.location).toBe('play area');
                expect(this.shinobu.isDishonored).toBe(true);
            });
        });
    });
});
