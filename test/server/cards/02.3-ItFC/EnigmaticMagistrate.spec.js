describe('Enigmatic Magistrate', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['enigmatic-magistrate', 'illusionary-decoy', 'miya-mystic']
                }
            });
            this.magistrate = this.player1.findCardByName('enigmatic-magistrate');
            this.decoy = this.player1.findCardByName('illusionary-decoy');
            this.mystic = this.player1.findCardByName('miya-mystic');
        });

        it('only counts characters with an odd printed cost, a dash counting as 0', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.magistrate, this.decoy, this.mystic],
                defenders: []
            });
            expect(this.game.currentConflict.attackerSkill).toBe(2);
        });
    });
});
