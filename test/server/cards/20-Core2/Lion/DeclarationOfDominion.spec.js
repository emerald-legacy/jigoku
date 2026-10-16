describe('Declaration of Dominion', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'doji-challenger'],
                    hand: ['declaration-of-dominion']
                },
                player2: {
                    inPlay: ['kakita-asami'],
                    provinces: ['ancestral-lands', 'pilgrimage']
                }
            });

            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.declaration = this.player1.findCardByName('declaration-of-dominion');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.ancestralLands = this.player2.findCardByName('ancestral-lands');
            this.pilgrimage = this.player2.findCardByName('pilgrimage');

            this.player1.playAttachment(this.declaration, this.ancestralLands);
            expect(this.declaration.parent).toBe(this.ancestralLands);
        });

        it('should give pride to one participating character on each side', function() {
            this.noMoreActions();
            this.initiateConflict({
                province: this.ancestralLands,
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.declaration);
            expect(this.player1).toHavePrompt('Choose a character on your side');
            expect(this.player1).toBeAbleToSelect(this.brashSamurai);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.asami);
            this.player1.clickCard(this.brashSamurai);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a character on the enemy side');
            expect(this.player1).toBeAbleToSelect(this.asami);
            this.player1.clickCard(this.asami);
            this.player1.clickPrompt('Done');
            expect(this.brashSamurai.hasKeyword('pride')).toBe(true);
            expect(this.asami.hasKeyword('pride')).toBe(true);
            expect(this.challenger.hasKeyword('pride')).toBe(false);

            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 2 vs 1');
            this.player1.clickCard(this.brashSamurai);
            expect(this.getChatLogs(3)).toContain('Brash Samurai is honored due to their Pride');
            expect(this.getChatLogs(3)).toContain('Kakita Asami is dishonored due to their Pride');
            expect(this.brashSamurai.isHonored).toBe(true);
            expect(this.asami.isDishonored).toBe(true);
        });

        it('should allow choosing no character on the enemy side', function() {
            this.noMoreActions();
            this.initiateConflict({
                province: this.ancestralLands,
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.declaration);
            this.player1.clickCard(this.brashSamurai);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            expect(this.brashSamurai.hasKeyword('pride')).toBe(true);
            expect(this.asami.hasKeyword('pride')).toBe(false);
        });

        it('should not be usable in a conflict at another province', function() {
            this.noMoreActions();
            this.initiateConflict({
                province: this.pilgrimage,
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.declaration);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.brashSamurai.hasKeyword('pride')).toBe(false);
        });
    });
});
