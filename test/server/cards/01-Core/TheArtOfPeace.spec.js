describe('The Art of Peace', function() {
    integration(function() {
        describe('The Art of Peace\'s interrupt', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider', 'aggressive-moto', 'asahina-storyteller']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'kakita-yoshi'],
                        provinces: ['the-art-of-peace']
                    }
                });

                this.borderRider = this.player1.findCardByName('border-rider');
                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.storyteller = this.player1.findCardByName('asahina-storyteller');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.yoshi = this.player2.findCardByName('kakita-yoshi');
                this.artOfPeace = this.player2.findCardByName('the-art-of-peace');
                this.noMoreActions();
            });

            it('should dishonor attackers and honor defenders when broken in a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.borderRider, this.aggressiveMoto],
                    defenders: [this.whisperer],
                    province: this.artOfPeace
                });
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.artOfPeace);
                expect(this.artOfPeace.isBroken).toBe(true);
                expect(this.borderRider.isDishonored).toBe(true);
                expect(this.aggressiveMoto.isDishonored).toBe(true);
                expect(this.whisperer.isHonored).toBe(true);
            });

            it('should dishonor attackers and honor defenders when broken in a political conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.borderRider, this.storyteller],
                    defenders: [],
                    province: this.artOfPeace
                });
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.artOfPeace);
                expect(this.artOfPeace.isBroken).toBe(true);
                expect(this.borderRider.isDishonored).toBe(true);
                expect(this.storyteller.isDishonored).toBe(true);
            });

            it('should not affect non-participating characters', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.borderRider, this.aggressiveMoto],
                    defenders: [this.whisperer],
                    province: this.artOfPeace
                });
                this.noMoreActions();
                this.player2.clickCard(this.artOfPeace);
                expect(this.artOfPeace.isBroken).toBe(true);
                expect(this.yoshi.isHonored).toBe(false);
                expect(this.yoshi.isDishonored).toBe(false);
            });
        });
    });
});
