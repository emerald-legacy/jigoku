describe('Vengeful Berserker', function() {
    integration(function() {
        describe('Vengeful Berserker\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 0,
                        inPlay: ['vengeful-berserker', 'kaiu-envoy'],
                        hand: ['fine-katana', 'banzai'],
                        dynastyDeck: ['funeral-pyre']
                    }
                });
                this.funeralPyre = this.player1.placeCardInProvince('funeral-pyre');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['vengeful-berserker'],
                    defenders: []
                });
            });

            it('should double Vengeful Berserker\'s military strength', function() {
                this.player2.pass();
                this.player1.clickCard(this.funeralPyre);
                this.player1.clickCard('kaiu-envoy');
                expect(this.player1.player.hand.length).toBe(3);
                expect(this.player1.fate).toBe(1);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('vengeful-berserker');
                this.vengefulBerserker = this.player1.clickCard('vengeful-berserker');
                expect(this.vengefulBerserker.militarySkill).toBe(6);
                expect(this.player1.player.hand.length).toBe(4);
            });

            it('does not trigger when Vengeful Berserker itself leaves play', function() {
                this.player2.pass();
                this.player1.clickCard(this.funeralPyre);
                this.player1.clickCard('vengeful-berserker');
                expect(this.player1.findCardByName('vengeful-berserker').location).toBe('dynasty discard pile');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('when a character controlled by the opponent leaves play', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['vengeful-berserker']
                    },
                    player2: {
                        inPlay: ['kaiu-envoy'],
                        dynastyDeck: ['funeral-pyre']
                    }
                });
                this.berserker = this.player1.findCardByName('vengeful-berserker');
                this.envoy = this.player2.findCardByName('kaiu-envoy');
                this.funeralPyre = this.player2.placeCardInProvince('funeral-pyre');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.berserker],
                    defenders: []
                });
            });

            it('does not trigger when a character controlled by the opponent leaves play', function() {
                this.player2.clickCard(this.funeralPyre);
                this.player2.clickCard(this.envoy);
                expect(this.envoy.location).toBe('dynasty discard pile');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.berserker.militarySkill).toBe(3);
            });
        });

        describe('when a character you control leaves play outside a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['vengeful-berserker', 'kaiu-envoy'],
                        dynastyDeck: ['funeral-pyre']
                    }
                });
                this.berserker = this.player1.findCardByName('vengeful-berserker');
                this.envoy = this.player1.findCardByName('kaiu-envoy');
                this.funeralPyre = this.player1.placeCardInProvince('funeral-pyre');
            });

            it('does not trigger when a character you control leaves play outside a conflict', function() {
                expect(this.game.currentConflict).toBeNull();
                this.player1.clickCard(this.funeralPyre);
                this.player1.clickCard(this.envoy);
                expect(this.envoy.location).toBe('dynasty discard pile');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.berserker.militarySkill).toBe(3);
            });
        });
    });
});
