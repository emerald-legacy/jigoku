describe('Trusted Advisor', function() {
    integration(function() {
        describe('Trusted Advisor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['trusted-advisor'],
                        hand: ['court-games']
                    },
                    player2: {
                        inPlay: ['bayushi-shoju']
                    }
                });

                this.trustedAdvisor = this.player1.findCardByName('trusted-advisor');
                this.bayushiShoju = this.player2.findCardByName('bayushi-shoju');

                this.game.rings.air.fate = 1;
            });

            it('should trigger when you gain fate during a conflict in which Trusted Advisor is participating', function() {
                const handSize = this.player1.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.trustedAdvisor],
                    ring: 'air'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.trustedAdvisor);

                this.player1.clickCard(this.trustedAdvisor);
                expect(this.player1.hand.length).toBe(handSize + 1);
            });

            it('should not trigger when an opponent gains fate during a conflict in which Trusted Advisor is participating', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiShoju],
                    defenders: [this.trustedAdvisor],
                    ring: 'air'
                });
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.trustedAdvisor);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Trusted Advisor\'s ability while at home', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['trusted-advisor', 'matsu-berserker'],
                        fate: 5
                    },
                    player2: {
                        inPlay: ['bayushi-shoju']
                    }
                });

                this.trustedAdvisor = this.player1.findCardByName('trusted-advisor');
                this.berserker = this.player1.findCardByName('matsu-berserker');

                this.game.rings.air.fate = 1;
            });

            it('does not trigger when you gain fate from a ring during a conflict it is not participating in', function() {
                const handSize = this.player1.hand.length;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berserker],
                    ring: 'air'
                });
                expect(this.player1.fate).toBe(6);
                expect(this.trustedAdvisor.isParticipating()).toBe(false);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Choose defenders');
                expect(this.player1.hand.length).toBe(handSize);
            });
        });
    });
});

