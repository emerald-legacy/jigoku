describe('Spies at Court', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'kakita-asami', 'border-rider'],
                    hand: ['spies-at-court', 'spies-at-court']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'kakita-asami'],
                    hand: ['banzai', 'charge', 'rout'],
                    provinces: ['entrenched-position']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.asami = this.player1.findCardByName('kakita-asami');
            this.borderRider = this.player1.findCardByName('border-rider');
            [this.spies1, this.spies2] = this.player1.filterCardsByName('spies-at-court', 'hand');
            this.p2Whisperer = this.player2.findCardByName('doji-whisperer');
            this.p2Asami = this.player2.findCardByName('kakita-asami');
            this.noMoreActions();
        });

        it('dishonors a participating character you control to make your opponent discard 2 cards at random after you win a political conflict', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                province: 'entrenched-position',
                attackers: [this.whisperer, this.asami],
                defenders: [this.p2Whisperer]
            });
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.spies1);
            this.player1.clickCard(this.spies1);
            expect(this.player1).toHavePrompt('Select character to dishonor');
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.isDishonored).toBe(true);
            expect(this.player2.hand.length).toBe(1);
            expect(this.player2.conflictDiscard.length).toBe(2);
        });

        it('can only dishonor a participating character you control as its cost', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                province: 'entrenched-position',
                attackers: [this.whisperer, this.asami],
                defenders: [this.p2Whisperer]
            });
            this.noMoreActions();
            this.player1.clickCard(this.spies1);
            expect(this.player1).toHavePrompt('Select character to dishonor');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.asami);
            expect(this.player1).not.toBeAbleToSelect(this.borderRider);
            expect(this.player1).not.toBeAbleToSelect(this.p2Whisperer);
        });

        it('can be used only once per conflict', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                province: 'entrenched-position',
                attackers: [this.whisperer, this.asami],
                defenders: [this.p2Whisperer]
            });
            this.noMoreActions();
            this.player1.clickCard(this.spies1);
            this.player1.clickCard(this.whisperer);
            expect(this.player2.hand.length).toBe(1);
            expect(this.spies2.location).toBe('hand');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Gain 2 Honor');
        });

        it('does not trigger after you win a military conflict', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                province: 'entrenched-position',
                attackers: [this.whisperer, this.asami],
                defenders: [this.p2Whisperer]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 1 vs 0');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Gain 2 Honor');
        });

        it('does not trigger after you lose a political conflict', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                province: 'entrenched-position',
                attackers: [this.whisperer],
                defenders: [this.p2Whisperer, this.p2Asami]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player2 won a political conflict 6 vs 3');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2.hand.length).toBe(3);
        });
    });
});
