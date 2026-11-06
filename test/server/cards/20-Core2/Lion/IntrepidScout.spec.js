describe('Intrepid Scout', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['intrepid-scout', 'brash-samurai', 'doji-challenger']
                },
                player2: {
                    inPlay: ['kakita-asami', 'kakita-yoshi']
                }
            });

            this.scout = this.player1.findCardByName('intrepid-scout');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
        });

        it('should move a character you control to the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.scout],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.scout);
            expect(this.player1).toHavePrompt('Intrepid Scout');
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.brashSamurai);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            this.player1.clickCard(this.challenger);
            expect(this.challenger.isAttacking()).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Intrepid Scout to move Doji Challenger into the conflict');
        });

        it('should not be usable while it is not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.scout);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.scout.isParticipating()).toBe(false);
            expect(this.challenger.isParticipating()).toBe(false);
        });

        it('should not be usable outside a conflict', function() {
            this.player1.clickCard(this.scout);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player1).not.toHavePrompt('Intrepid Scout');
        });
    });
});
