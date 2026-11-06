describe('Fallow Lands', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger']
                },
                player2: {
                    fate: 5,
                    honor: 10,
                    provinces: ['fallow-lands']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.fallowLands = this.player2.findCardByName('fallow-lands', 'province 1');
        });

        it('should draw a card, gain a fate and gain an honor after it is revealed', function() {
            const hand = this.player2.hand.length;
            expect(this.fallowLands.facedown).toBe(true);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                province: this.fallowLands
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.fallowLands);
            this.player2.clickCard(this.fallowLands);
            expect(this.player2.hand.length).toBe(hand + 1);
            expect(this.player2.fate).toBe(6);
            expect(this.player2.honor).toBe(11);
            expect(this.getChatLogs(3)).toContain('player2 uses Fallow Lands to draw 1 card, gain 1 fate, and gain 1 honor');
        });

        it('should not trigger when another province is revealed', function() {
            const otherProvince = this.player2.findCardByName('shameful-display', 'province 2');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                province: otherProvince
            });
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.player2.fate).toBe(5);
        });
    });
});
