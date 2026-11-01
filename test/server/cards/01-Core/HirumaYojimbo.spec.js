describe('Hiruma Yojimbo', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hiruma-yojimbo', 'akodo-gunso']
                },
                player2: {
                    inPlay: ['matsu-berserker']
                }
            });
            this.yojimbo = this.player1.findCardByName('hiruma-yojimbo');
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.noMoreActions();
        });

        it('should not be able to be declared as an attacker', function() {
            expect(this.player1).toHavePrompt('Initiate Conflict');
            this.player1.clickRing('air');
            this.player1.clickCard(this.yojimbo);
            expect(this.yojimbo.inConflict).toBe(false);
            expect(this.game.currentConflict.attackers).not.toContain(this.yojimbo);
            this.player1.clickCard(this.gunso);
            expect(this.game.currentConflict.attackers).toContain(this.gunso);
        });

        it('should be able to be declared as a defender', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.yojimbo]
            });
            expect(this.yojimbo.isDefending()).toBe(true);
        });
    });
});
