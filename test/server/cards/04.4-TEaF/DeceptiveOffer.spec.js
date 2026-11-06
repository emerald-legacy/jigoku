describe('Deceptive Offer', function() {
    integration(function() {
        describe('Deceptive Offer\'s action', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-manipulator'],
                        hand: ['deceptive-offer'],
                        honor: 10
                    },
                    player2: {
                        honor: 10
                    }
                });
                this.noMoreActions();
                this.bayushiManipulator = this.player1.findCardByName('bayushi-manipulator');
            });

            it('should prompt a character to be chosen', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiManipulator],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('deceptive-offer');

                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should give the opponent an option to select between effects', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiManipulator],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('deceptive-offer');
                this.player1.clickCard(this.bayushiManipulator);

                expect(this.player2).toHavePromptButton('Allow your opponent\'s character to gain military and political skill');
                expect(this.player2).toHavePromptButton('Give your opponent 1 honor');
            });

            it('should give +2/+2 when the option is selected', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiManipulator],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('deceptive-offer');
                this.player1.clickCard(this.bayushiManipulator);
                this.player2.clickPrompt('Allow your opponent\'s character to gain military and political skill');

                expect(this.bayushiManipulator.militarySkill).toBe(3);
                expect(this.bayushiManipulator.politicalSkill).toBe(3);
            });

            it('should cause the opponent to lose 1 honor and the player to gain 1 honor', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiManipulator],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('deceptive-offer');
                this.player1.clickCard(this.bayushiManipulator);
                this.player2.clickPrompt('Give your opponent 1 honor');

                expect(this.player1.player.honor).toBe(11);
                expect(this.player2.player.honor).toBe(9);
            });

        });
    });
});

describe('Deceptive Offer at Festival of the Departed', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-manipulator'],
                    hand: ['deceptive-offer']
                },
                player2: {
                    provinces: ['festival-of-the-departed']
                }
            });
            this.manipulator = this.player1.findCardByName('bayushi-manipulator');
            this.festival = this.player2.findCardByName('festival-of-the-departed');
        });

        it('cannot be played when the skills can\'t be increased (EmeraldDB ruling)', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.festival,
                attackers: [this.manipulator],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard('deceptive-offer');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1.findCardByName('deceptive-offer').location).toBe('hand');
        });
    });
});

describe('Deceptive Offer against an opponent who can\'t lose honor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-manipulator'],
                    hand: ['deceptive-offer'],
                    honor: 10
                },
                player2: {
                    inPlay: ['righteous-magistrate'],
                    honor: 10
                }
            });
            this.bayushiManipulator = this.player1.findCardByName('bayushi-manipulator');
            this.righteousMagistrate = this.player2.findCardByName('righteous-magistrate');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.bayushiManipulator],
                defenders: [this.righteousMagistrate]
            });
            this.player2.pass();
        });

        // ruling #600: the opponent must choose an option that can change the game state
        it('only lets the opponent choose the +2/+2', function() {
            this.player1.clickCard('deceptive-offer');
            this.player1.clickCard(this.bayushiManipulator);
            expect(this.player2).not.toHavePromptButton('Give your opponent 1 honor');
            expect(this.bayushiManipulator.militarySkill).toBe(3);
            expect(this.bayushiManipulator.politicalSkill).toBe(3);
            expect(this.player1.honor).toBe(10);
            expect(this.player2.honor).toBe(10);
            expect(this.getChatLogs(3)).toContain('player1 plays Deceptive Offer to give +2/+2 to Bayushi Manipulator');
        });
    });
});
