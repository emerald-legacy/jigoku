describe('Advance Towards the Rear', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['brash-samurai', 'doji-challenger', 'akodo-toturi'],
                    hand: ['advance-towards-the-rear']
                },
                player2: {
                    inPlay: ['kakita-asami']
                }
            });

            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.advance = this.player1.findCardByName('advance-towards-the-rear');
            this.asami = this.player2.findCardByName('kakita-asami');
        });

        it('should lose 1 honor and move a participating character you control home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai, this.challenger],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.advance);
            expect(this.player1).toBeAbleToSelect(this.brashSamurai);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.toturi);
            expect(this.player1).not.toBeAbleToSelect(this.asami);
            this.player1.clickCard(this.challenger);
            expect(this.challenger.isParticipating()).toBe(false);
            expect(this.brashSamurai.isAttacking()).toBe(true);
            expect(this.player1.honor).toBe(9);
        });

        it('should not be playable in a political conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brashSamurai, this.challenger],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.advance);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.advance.location).toBe('hand');
            expect(this.player1.honor).toBe(10);
        });

        it('should not be playable outside a conflict', function() {
            this.player1.clickCard(this.advance);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.advance.location).toBe('hand');
            expect(this.player1.honor).toBe(10);
        });
    });
});
