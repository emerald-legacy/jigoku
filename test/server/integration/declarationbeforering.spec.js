// Attackers may be picked before the ring; an element restriction (Fire Tensai Acolyte) is only
// decided once a ring is chosen, and choosing or switching the ring checks the attackers again.
describe('declaring attackers before the ring', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['fire-tensai-acolyte', 'isawa-masahiro']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.acolyte = this.player1.findCardByName('fire-tensai-acolyte');
            this.masahiro = this.player1.findCardByName('isawa-masahiro');
            this.province = this.player2.findCardByName('shameful-display', 'province 1');
            this.noMoreActions();
        });

        it('deselects an attacker picked before the ring while Fire Tensai Acolyte is in play', function() {
            this.player1.clickCard(this.masahiro);
            expect(this.game.currentConflict.attackers).toContain(this.masahiro);
            this.player1.clickCard(this.masahiro);
            expect(this.game.currentConflict.attackers).not.toContain(this.masahiro);
            expect(this.player1).toHavePrompt('Initiate Conflict');
        });

        it('lets Fire Tensai Acolyte attack once the fire ring is chosen', function() {
            this.player1.clickCard(this.masahiro);
            this.player1.clickRing('fire');
            this.player1.clickCard(this.acolyte);
            this.player1.clickCard(this.province);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.game.currentConflict.attackers).toContain(this.masahiro);
            expect(this.game.currentConflict.attackers).toContain(this.acolyte);
        });

        it('keeps Fire Tensai Acolyte out when a different ring is chosen', function() {
            this.player1.clickCard(this.masahiro);
            this.player1.clickRing('water');
            this.player1.clickCard(this.acolyte);
            this.player1.clickCard(this.province);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.game.currentConflict.attackers).toContain(this.masahiro);
            expect(this.game.currentConflict.attackers).not.toContain(this.acolyte);
        });

        it('removes Fire Tensai Acolyte when the ring is switched away from fire', function() {
            this.player1.clickCard(this.masahiro);
            this.player1.clickRing('fire');
            this.player1.clickCard(this.acolyte);
            expect(this.game.currentConflict.attackers).toContain(this.acolyte);
            this.player1.clickRing('water');
            expect(this.game.currentConflict.attackers).toContain(this.masahiro);
            expect(this.game.currentConflict.attackers).not.toContain(this.acolyte);
        });

        it('keeps Fire Tensai Acolyte when only the conflict type of the fire ring changes', function() {
            this.player1.clickCard(this.masahiro);
            this.player1.clickRing('fire');
            this.player1.clickCard(this.acolyte);
            this.player1.clickRing('fire');
            expect(this.game.rings.fire.conflictType).toBe('political');
            expect(this.game.currentConflict.attackers).toContain(this.acolyte);
        });
    });
});
