describe('Border\'s Edge Barracks', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-manipulator']
                },
                player2: {
                    dynastyDiscard: ['border-s-edge-barracks'],
                    inPlay: ['adept-of-the-waves', 'asako-diplomat', 'naive-student']
                }
            });
            this.bayushiManipulatorr = this.player1.findCardByName('bayushi-manipulator');

            this.bordersEdgeBarracks = this.player2.placeCardInProvince('border-s-edge-barracks', 'province 1');
            this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
            this.asakoDiplomat = this.player2.findCardByName('asako-diplomat');
            this.naiveStudent = this.player2.findCardByName('naive-student');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.bayushiManipulatorr],
                defenders: []
            });
            this.player2.clickCard(this.bordersEdgeBarracks);
        });

        it('moves a character into the defense', function () {
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).not.toBeAbleToSelect(this.bayushiManipulatorr);
            expect(this.player2).not.toBeAbleToSelect(this.naiveStudent);
            expect(this.player2).toBeAbleToSelect(this.asakoDiplomat);

            this.player2.clickCard(this.asakoDiplomat);
            expect(this.asakoDiplomat.inConflict).toBe(true);
        });

        it('can only be used once per conflict', function () {
            this.player2.clickCard(this.asakoDiplomat);
            expect(this.asakoDiplomat.inConflict).toBe(true);
            this.player1.pass();
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.bordersEdgeBarracks);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.adeptOfTheWaves.inConflict).toBe(false);
        });
    });
});

describe('Border\'s Edge Barracks while attacking', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-manipulator']
                },
                player2: {
                    dynastyDiscard: ['border-s-edge-barracks'],
                    inPlay: ['adept-of-the-waves', 'asako-diplomat']
                }
            });
            this.bayushiManipulator = this.player1.findCardByName('bayushi-manipulator');

            this.bordersEdgeBarracks = this.player2.placeCardInProvince('border-s-edge-barracks', 'province 1');
            this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
            this.asakoDiplomat = this.player2.findCardByName('asako-diplomat');

            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.adeptOfTheWaves],
                defenders: [this.bayushiManipulator]
            });
            this.player1.pass();
        });

        it('cannot be used by the attacking player', function () {
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.bordersEdgeBarracks);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.asakoDiplomat.inConflict).toBe(false);
            expect(this.adeptOfTheWaves.isAttacking()).toBe(true);
        });
    });
});
