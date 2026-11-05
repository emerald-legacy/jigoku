describe('No winner although a side counts skill', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hiruma-yoshino'],
                    hand: ['retreat']
                },
                player2: {
                    dynastyDiscard: ['akodo-toturi'],
                    provinces: ['shameful-display']
                }
            });
            this.yoshino = this.player1.findCardByName('hiruma-yoshino');
            this.retreat = this.player1.findCardByName('retreat');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.display = this.player2.findCardByName('shameful-display', 'province 1');
            this.player2.placeCardInProvince(this.toturi, 'province 1');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.display,
                attackers: [this.yoshino],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.yoshino);
            this.player1.clickCard(this.toturi);
            this.player2.pass();
            this.player1.clickCard(this.retreat);
            this.player1.clickCard(this.yoshino);
        });

        it('gives no reason', function() {
            expect(this.yoshino.isParticipating()).toBe(false);
            expect(this.game.currentConflict.attackerSkill).toBe(6);
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('There is no winner or loser for this conflict');
        });
    });
});
