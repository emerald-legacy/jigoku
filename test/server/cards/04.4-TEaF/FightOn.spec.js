describe('Fight On', function() {
    integration(function() {
        describe('Fight On\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrewd-yasuki', 'vanguard-warrior']
                    },
                    player2: {
                        inPlay: ['borderlands-defender'],
                        hand: ['fight-on']
                    }
                });

                this.borderlandsDefender = this.player2.inPlay[0];
                this.borderlandsDefender.bow();
                this.vaguardWarrior = this.player1.inPlay[1];
                this.vaguardWarrior.bow();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['shrewd-yasuki'],
                    defenders: []
                });
                this.player2.clickCard('fight-on');
            });

            it('should ready selected bowed character and move it to the conflict', function() {
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.borderlandsDefender.bowed).toBeFalsy();
                expect(this.borderlandsDefender.inConflict).toBeTruthy();
                expect(this.getChatLogs(3)).toContain('player2 plays Fight On to ready Borderlands Defender and move it into the conflict');
            });

            it('should not be able to select an opponents character', function() {
                expect(this.player2).not.toBeAbleToSelect(this.vaguardWarrior);
                expect(this.player2).toBeAbleToSelect(this.borderlandsDefender);
            });
        });
    });
});

describe('Fight On during a conflict with a bowed defender', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shrewd-yasuki'],
                    hand: ['fight-on']
                },
                player2: {
                    inPlay: ['borderlands-defender'],
                    hand: ['fight-on']
                }
            });
            this.shrewdYasuki = this.player1.findCardByName('shrewd-yasuki');
            this.attackersFightOn = this.player1.findCardByName('fight-on');
            this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.shrewdYasuki],
                defenders: [this.borderlandsDefender]
            });
        });

        // ruling #663
        it('readies a bowed character that is already participating', function() {
            this.borderlandsDefender.bow();
            this.player2.clickCard('fight-on');
            expect(this.player2).toBeAbleToSelect(this.borderlandsDefender);
            this.player2.clickCard(this.borderlandsDefender);
            expect(this.borderlandsDefender.bowed).toBe(false);
            expect(this.borderlandsDefender.inConflict).toBe(true);
            expect(this.getChatLogs(3)).toContain('player2 plays Fight On to ready Borderlands Defender');
        });

        it('cannot be played by the attacking player', function() {
            this.shrewdYasuki.bow();
            this.player2.pass();
            this.player1.clickCard(this.attackersFightOn);
            expect(this.attackersFightOn.location).toBe('hand');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.shrewdYasuki.bowed).toBe(true);
        });
    });
});
