describe('Akodo Gunso', function () {
    integration(function () {
        describe('In the dynasty phase, Akodo Gunso\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['akodo-toturi'],
                        dynastyDiscard: ['akodo-gunso']
                    },
                    player2: {
                    }
                });
                this.akodoGunso = this.player1.placeCardInProvince('akodo-gunso', 'province 1');
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
            });

            it('should trigger when bought', function () {
                this.player1.clickCard(this.akodoGunso);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.akodoGunso);
                this.player1.clickCard(this.akodoGunso);
                this.newCard = this.player1.player.getDynastyCardInProvince('province 1');
                expect(this.newCard.facedown).toBe(false);
            });
        });

        describe('In the conflict phase, Akodo Gunso\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toturi'],
                        dynastyDiscard: ['akodo-gunso'],
                        hand: ['charge']
                    },
                    player2: {
                    }
                });
                this.akodoGunso = this.player1.placeCardInProvince('akodo-gunso', 'province 1');
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.charge = this.player1.findCardByName('charge');
                this.noMoreActions();
            });

            it('should trigger when put into play', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.akodoToturi],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.charge);
                this.player1.clickCard(this.akodoGunso);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.akodoGunso);
                this.player1.clickCard(this.akodoGunso);
                this.newCard = this.player1.player.getDynastyCardInProvince('province 1');
                expect(this.newCard.facedown).toBe(false);
            });
        });

        describe('Akodo Gunso played as if from hand', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 10,
                        dynastyDiscard: ['hidden-moon-dojo', 'akodo-gunso']
                    }
                });
                this.dojo = this.player1.placeCardInProvince('hidden-moon-dojo', 'province 1');
                this.dojo.facedown = false;
                this.akodoGunso = this.player1.placeCardInProvince('akodo-gunso', 'province 2');
                this.akodoGunso.facedown = false;
            });

            it('should trigger: it entered play from a province', function () {
                this.player1.clickCard(this.akodoGunso);
                this.player1.clickPrompt('0');
                expect(this.akodoGunso.location).toBe('play area');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.akodoGunso);
                this.player1.clickCard(this.akodoGunso);
                expect(this.player1.player.getDynastyCardInProvince('province 2').facedown).toBe(false);
            });
        });
    });
});
