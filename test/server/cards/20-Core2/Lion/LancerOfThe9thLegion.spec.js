describe('Lancer of the 9th Legion', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['lancer-of-the-9th-legion', 'border-rider'],
                    hand: []
                },
                player2: {
                    inPlay: ['doji-challenger', 'solemn-scholar', 'togashi-yokuni'],
                    hand: []
                }
            });

            this.lancer = this.player1.findCardByName('lancer-of-the-9th-legion');
            this.rider = this.player1.findCardByName('border-rider');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');
        });

        it('should bow an enemy character with equal or lower military skill', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.lancer],
                defenders: [this.challenger, this.scholar]
            });

            this.player2.pass();
            this.player1.clickCard(this.lancer);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            expect(this.player1).not.toBeAbleToSelect(this.yokuni);

            this.player1.clickCard(this.challenger);
            expect(this.challenger.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Lancer of the 9th Legion to bow Doji Challenger');
        });

        it('should not be usable outside a military conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.lancer],
                defenders: [this.challenger]
            });

            this.player2.pass();
            this.player1.clickCard(this.lancer);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should not be usable from home', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.rider],
                defenders: [this.scholar]
            });

            this.player2.pass();
            this.player1.clickCard(this.lancer);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should only target opposing characters', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.lancer, this.rider],
                defenders: [this.scholar]
            });

            this.player2.pass();
            this.player1.clickCard(this.lancer);
            expect(this.player1).not.toBeAbleToSelect(this.rider);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            this.player1.clickCard(this.scholar);
            expect(this.scholar.bowed).toBe(true);
        });
    });
});
