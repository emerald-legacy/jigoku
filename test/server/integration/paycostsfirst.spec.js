describe('Pay costs first', function() {
    integration(function() {
        describe('on a token target', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['exiled-guardian', 'young-rumormonger']
                    }
                });
                this.guardian = this.player1.findCardByName('exiled-guardian');
                this.rumormonger = this.player1.findCardByName('young-rumormonger');
                this.rumormonger.dishonor();
            });

            it('pays the cost, then asks for the token', function() {
                this.player1.clickCard(this.guardian);
                expect(this.player1).toHavePromptButton('Pay costs first');
                this.player1.clickPrompt('Pay costs first');
                expect(this.guardian.location).toBe('dynasty discard pile');
                this.player1.clickCard(this.rumormonger);
                expect(this.rumormonger.isDishonored).toBe(false);
            });
        });

        describe('on an element target', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['master-alchemist'],
                        stronghold: ['twin-soul-temple']
                    }
                });
                this.temple = this.player1.findCardByName('twin-soul-temple');
                this.alchemist = this.player1.findCardByName('master-alchemist');
            });

            it('pays the cost, then asks for the element', function() {
                this.player1.clickCard(this.temple);
                expect(this.player1).toHavePromptButton('Pay costs first');
                this.player1.clickPrompt('Pay costs first');
                expect(this.temple.bowed).toBe(true);
                this.player1.clickCard(this.alchemist);
                expect(this.player1).toHavePrompt('Choose the new element');
            });
        });

        describe('on an ability target', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['countryside-trader']
                    },
                    player2: {
                        provinces: ['manicured-garden']
                    }
                });
                this.trader = this.player1.findCardByName('countryside-trader');
                this.garden = this.player2.findCardByName('manicured-garden', 'province 1');
                this.garden.facedown = false;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.trader],
                    defenders: [],
                    province: this.garden
                });
                this.player2.pass();
            });

            it('pays the cost, then asks for the ability', function() {
                const fate = this.player1.fate;
                this.player1.clickCard(this.trader);
                expect(this.player1).toHavePromptButton('Pay costs first');
                this.player1.clickPrompt('Pay costs first');
                expect(this.player1.fate).toBe(fate - 1);
                this.player1.clickCard(this.garden);
                expect(this.player1.fate).toBe(fate);
                expect(this.getChatLogs(5)).toContain('player1 resolves Manicured Garden to gain 1 fate');
            });
        });

        describe('on an attachment whose cost depends on its target', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        inPlay: ['relentless-gloryseeker'],
                        hand: ['promising-hohei']
                    }
                });
                this.gloryseeker = this.player1.findCardByName('relentless-gloryseeker');
                this.hohei = this.player1.findCardByName('promising-hohei');
            });

            it('is not offered, so the reduction for the chosen character applies', function() {
                this.player1.clickCard(this.hohei);
                expect(this.player1).toHavePrompt('Choose a card');
                expect(this.player1).not.toHavePromptButton('Pay costs first');
                this.player1.clickCard(this.gloryseeker);
                expect(this.gloryseeker.attachments).toContain(this.hohei);
                expect(this.player1.fate).toBe(5);
            });
        });
    });
});
