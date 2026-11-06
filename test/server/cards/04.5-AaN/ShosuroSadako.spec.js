describe('Shosuro Sadako', function() {
    integration(function() {
        describe('Shosuro Sadako\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shosuro-sadako', 'bayushi-yojiro'],
                        hand: ['court-games', 'fine-katana'],
                        dynastyDiscard: ['favorable-ground']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['court-games', 'cloud-the-mind']
                    }
                });
                this.shosuroSadako = this.player1.findCardByName('shosuro-sadako');
                this.bayushiYojiro = this.player1.findCardByName('bayushi-yojiro');
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground', 'province 1');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shosuroSadako],
                    defenders: []
                });
            });

            it('should not affect her skills when ordinary', function() {
                expect(this.shosuroSadako.militarySkill).toBe(1);
                expect(this.shosuroSadako.politicalSkill).toBe(1);
            });

            it('should not affect her skills when honored', function() {
                this.player2.pass();
                this.player1.clickCard('court-games');
                this.player1.clickPrompt('Honor a friendly character');
                this.player1.clickCard(this.shosuroSadako);
                expect(this.shosuroSadako.isHonored).toBe(true);
                expect(this.shosuroSadako.militarySkill).toBe(4);
                expect(this.shosuroSadako.politicalSkill).toBe(4);
            });

            it('should increase her skills by her glory when dishonored', function() {
                this.player2.clickCard('court-games');
                this.player2.clickPrompt('Dishonor an opposing character');
                this.player1.clickCard(this.shosuroSadako);
                expect(this.shosuroSadako.isDishonored).toBe(true);
                expect(this.shosuroSadako.militarySkill).toBe(4);
                expect(this.shosuroSadako.politicalSkill).toBe(4);
            });

            it('should not impact tainted tokens', function() {
                this.player2.clickCard('court-games');
                this.player2.clickPrompt('Dishonor an opposing character');
                this.player1.clickCard(this.shosuroSadako);
                expect(this.shosuroSadako.isDishonored).toBe(true);
                expect(this.shosuroSadako.militarySkill).toBe(4);
                expect(this.shosuroSadako.politicalSkill).toBe(4);
                this.shosuroSadako.taint();
                this.game.checkGameState(true);
                expect(this.shosuroSadako.militarySkill).toBe(6);
                expect(this.shosuroSadako.politicalSkill).toBe(6);
            });

            it('should be removed when Cloud the mind is played', function() {
                this.player2.clickCard('court-games');
                this.player2.clickPrompt('Dishonor an opposing character');
                this.player1.clickCard(this.shosuroSadako);
                expect(this.shosuroSadako.isDishonored).toBe(true);
                this.player1.playAttachment('fine-katana', this.shosuroSadako);
                expect(this.shosuroSadako.militarySkill).toBe(6);
                this.player2.playAttachment('cloud-the-mind', this.shosuroSadako);
                expect(this.shosuroSadako.militarySkill).toBe(0);
            });

            it('should have no effect when Bayushi Yojiro is participating', function() {
                this.player2.clickCard('court-games');
                this.player2.clickPrompt('Dishonor an opposing character');
                this.player1.clickCard(this.shosuroSadako);
                expect(this.shosuroSadako.isDishonored).toBe(true);
                expect(this.shosuroSadako.militarySkill).toBe(4);
                expect(this.shosuroSadako.politicalSkill).toBe(4);
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.bayushiYojiro);
                expect(this.bayushiYojiro.isParticipating()).toBe(true);
                expect(this.shosuroSadako.militarySkill).toBe(1);
                expect(this.shosuroSadako.politicalSkill).toBe(1);
            });
        });
    });
});

describe('Shosuro Sadako with Disciple of Deception', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['disciple-of-deception', 'young-rumormonger']
                },
                player2: {
                    inPlay: ['shosuro-sadako']
                }
            });
            this.deception = this.player1.findCardByName('disciple-of-deception');
            this.rumormonger = this.player1.findCardByName('young-rumormonger');
            this.sadako = this.player2.findCardByName('shosuro-sadako');
            this.rumormonger.dishonor();
            this.sadako.honor();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.deception],
                defenders: [this.sadako]
            });
            this.player2.pass();
        });

        it('adds her glory when her honored token is treated as dishonored', function() {
            this.player1.clickCard(this.deception);
            this.player1.clickCard(this.rumormonger);
            this.player1.clickCard(this.sadako);
            expect(this.sadako.isDishonored).toBe(true);
            expect(this.sadako.militarySkill).toBe(4);
            expect(this.sadako.politicalSkill).toBe(4);
        });
    });
});
