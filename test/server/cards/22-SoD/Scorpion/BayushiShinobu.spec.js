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

        describe('taking control', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-shinobu', 'daidoji-uji'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-diplomat', 'doji-kuwanan'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.shinobu = this.player1.findCardByName('bayushi-shinobu');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.kuwanan = this.player2.findCardByName('doji-kuwanan');
                this.assassination = this.player2.findCardByName('assassination');
                this.uji = this.player1.findCardByName('daidoji-uji');
                this.uji.honor();
                this.kuwanan.dishonor();
                this.keeper.dishonor();
            });

            it('takes control of a dishonored non-unique character: losing it this phase costs 2 honor', function () {
                this.player1.clickCard(this.shinobu);
                expect(this.player1).toBeAbleToSelect(this.keeper);
                expect(this.player1).not.toBeAbleToSelect(this.diplomat);
                expect(this.player1).not.toBeAbleToSelect(this.kuwanan);

                this.player1.clickCard(this.keeper);
                expect(this.getChatLogs(5)).toContain('player1 uses Bayushi Shinobu, bowing Bayushi Shinobu to take control of Keeper Initiate');

                const honor = this.player1.honor;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.keeper],
                    defenders: [this.diplomat]
                });

                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.keeper);

                expect(this.player1.honor).toBe(honor - 3); // 2 from the effect, 1 from the DH token
                expect(this.getChatLogs(5)).toContain('player1 loses 2 honor due to the delayed effect of Bayushi Shinobu');
            });
        });

        describe('at the end of the phase', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-shinobu']
                    },
                    player2: {
                        inPlay: ['keeper-initiate']
                    }
                });

                this.shinobu = this.player1.findCardByName('bayushi-shinobu');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.shinobu.fate = 1;
                this.keeper.dishonor();
            });

            it('gives control back at the end of the phase: leaving play later costs no honor', function () {
                this.player1.clickCard(this.shinobu);
                this.player1.clickCard(this.keeper);
                expect(this.keeper.controller).toBe(this.player1.player);

                const honor = this.player1.honor;
                this.advancePhases('fate');
                expect(this.keeper.controller).toBe(this.player2.player);

                this.player2.clickPrompt('Done');
                expect(this.keeper.location).toBe('dynasty discard pile');
                expect(this.player1.honor).toBe(honor);
                expect(this.getChatLogs(10)).not.toContain('player1 loses 2 honor due to the delayed effect of Bayushi Shinobu');
            });
        });
    });
});
