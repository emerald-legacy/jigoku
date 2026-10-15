describe('Hayate', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hayate', 'border-rider', 'adept-of-the-waves']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.hayate = this.player1.findCardByName('hayate');
            this.rider = this.player1.findCardByName('border-rider');
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.noMoreActions();
        });

        it('moves itself and another character to the conflict from home', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.adept],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.hayate);
            expect(this.player1).toBeAbleToSelect(this.rider);
            expect(this.player1).not.toBeAbleToSelect(this.hayate);
            this.player1.clickCard(this.rider);
            expect(this.hayate.isParticipating()).toBe(true);
            expect(this.rider.isParticipating()).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Hayate to move Hayate and Border Rider into the conflict');
        });

        it('can move only itself', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.adept],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.hayate);
            this.player1.clickPrompt('Done');
            expect(this.hayate.isParticipating()).toBe(true);
            expect(this.rider.isParticipating()).toBe(false);
            expect(this.getChatLogs(3)).toContain('player1 uses Hayate to move Hayate into the conflict');
        });

        it('can still move the other character in while participating itself', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.hayate],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.hayate);
            expect(this.player1).toBeAbleToSelect(this.rider);
            this.player1.clickCard(this.rider);
            expect(this.rider.isParticipating()).toBe(true);
        });
    });
});
