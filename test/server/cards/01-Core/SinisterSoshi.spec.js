describe('Sinister Soshi', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['sinister-soshi', 'doji-challenger', 'border-rider']
                },
                player2: {
                    inPlay: ['akodo-gunso', 'kakita-asami'],
                    provinces: ['entrenched-position']
                }
            });
            this.soshi = this.player1.findCardByName('sinister-soshi');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.borderRider = this.player1.findCardByName('border-rider');
            this.gunso = this.player2.findCardByName('akodo-gunso');
            this.asami = this.player2.findCardByName('kakita-asami');
        });

        it('cannot be used outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.soshi);
            expect(this.player1).toHavePrompt('Action Window');
        });

        describe('during a conflict', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    province: 'entrenched-position',
                    attackers: [this.challenger],
                    defenders: [this.gunso]
                });
                this.player2.pass();
            });

            it('gives a chosen participating character -2 military and -2 political', function() {
                this.player1.clickCard(this.soshi);
                expect(this.player1).toHavePrompt('Sinister Soshi');
                expect(this.player1).toBeAbleToSelect(this.gunso);
                expect(this.player1).toBeAbleToSelect(this.challenger);
                this.player1.clickCard(this.challenger);
                expect(this.challenger.militarySkill).toBe(1);
                expect(this.challenger.politicalSkill).toBe(1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('cannot choose a character that is not participating', function() {
                this.player1.clickCard(this.soshi);
                expect(this.player1).toHavePrompt('Sinister Soshi');
                expect(this.player1).toBeAbleToSelect(this.gunso);
                expect(this.player1).not.toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.asami);
            });

            it('ends the skill penalty at the end of the conflict', function() {
                this.player1.clickCard(this.soshi);
                this.player1.clickCard(this.challenger);
                expect(this.challenger.militarySkill).toBe(1);
                this.noMoreActions();
                expect(this.getChatLogs(10)).toContain('player2 won a military conflict 2 vs 1');
                expect(this.game.currentConflict).toBe(null);
                expect(this.challenger.militarySkill).toBe(3);
                expect(this.challenger.politicalSkill).toBe(3);
            });
        });
    });
});
