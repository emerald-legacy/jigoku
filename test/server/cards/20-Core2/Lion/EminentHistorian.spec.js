describe('Eminent Historian', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['eminent-historian', 'brash-samurai', 'doji-challenger']
                },
                player2: {
                    honor: 10,
                    inPlay: ['kakita-asami'],
                    hand: ['way-of-the-scorpion']
                }
            });

            this.historian = this.player1.findCardByName('eminent-historian');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');
        });

        it('should honor a participating character on your side, even from home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.historian);
            expect(this.player1).toHavePrompt('Eminent Historian');
            expect(this.player1).toBeAbleToSelect(this.brashSamurai);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.historian);
            expect(this.player1).not.toBeAbleToSelect(this.asami);
            this.player1.clickCard(this.brashSamurai);
            expect(this.brashSamurai.isHonored).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Eminent Historian to honor Brash Samurai');
        });

        it('should not be usable if an opponent is more honorable', function() {
            this.player2.honor = 11;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.historian);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.brashSamurai.isHonored).toBe(false);
        });

        it('should not be able to receive dishonored status tokens', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.historian, this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.clickCard(this.wayOfTheScorpion);
            expect(this.player2).toBeAbleToSelect(this.brashSamurai);
            expect(this.player2).not.toBeAbleToSelect(this.historian);
        });
    });
});
