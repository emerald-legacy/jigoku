describe('Political Rival', function() {
    integration(function() {
        describe('defending', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer']
                    },
                    player2: {
                        inPlay: ['political-rival']
                    }
                });
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.rival = this.player2.findCardByName('political-rival');
                this.noMoreActions();
            });

            it('gets +3 political skill while defending', function() {
                expect(this.rival.politicalSkill).toBe(3);
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer],
                    defenders: [this.rival]
                });
                expect(this.rival.isDefending()).toBe(true);
                expect(this.rival.politicalSkill).toBe(6);
            });
        });

        describe('attacking', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['political-rival']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'attendant-to-the-emperor']
                    }
                });
                this.rival = this.player1.findCardByName('political-rival');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.attendant = this.player2.findCardByName('attendant-to-the-emperor');
                this.province = this.player2.findCardByName('shameful-display', 'province 1');
                this.noMoreActions();
                this.player1.clickRing('earth');
                this.player1.clickCard(this.rival);
                this.player1.clickCard(this.province);
                this.player1.clickPrompt('Initiate Conflict');
            });

            it('has Covert: the chosen character cannot be declared as a defender', function() {
                expect(this.player1).toHavePrompt('Choose covert target for Political Rival');
                this.player1.clickCard(this.whisperer);
                expect(this.player2).toHavePrompt('Choose defenders');
                this.player2.clickCard(this.whisperer);
                this.player2.clickCard(this.attendant);
                expect(this.whisperer.inConflict).toBe(false);
                expect(this.attendant.inConflict).toBe(true);
            });

            it('does not get +3 political skill while attacking', function() {
                this.player1.clickCard(this.whisperer);
                expect(this.rival.isAttacking()).toBe(true);
                expect(this.rival.politicalSkill).toBe(3);
            });
        });
    });
});
