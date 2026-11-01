describe('Test of Courage', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'akodo-toturi'],
                    hand: ['test-of-courage']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.testOfCourage = this.player1.findCardByName('test-of-courage');
            this.player1.player.showBid = 1;
            this.player2.player.showBid = 3;
        });

        it('cannot be played outside a conflict', function() {
            this.player1.clickCard(this.testOfCourage);
            expect(this.testOfCourage.location).toBe('hand');
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('moves a character to the conflict, then honors it', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.testOfCourage);
            this.player1.clickCard(this.toturi);
            expect(this.toturi.isParticipating()).toBe(true);
            expect(this.toturi.isHonored).toBe(true);
        });
    });
});
