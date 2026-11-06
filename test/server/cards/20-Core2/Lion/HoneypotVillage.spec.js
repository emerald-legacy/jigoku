describe('Honeypot Village', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'doji-challenger', 'akodo-toturi']
                },
                player2: {
                    inPlay: ['kakita-asami', 'kakita-yoshi'],
                    provinces: ['honeypot-village', 'pilgrimage']
                }
            });

            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.honeypotVillage = this.player2.findCardByName('honeypot-village');
            this.pilgrimage = this.player2.findCardByName('pilgrimage');

            this.toturi.bowed = true;
        });

        it('should move a ready character the attacker controls to the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                province: this.honeypotVillage,
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.clickCard(this.honeypotVillage);
            expect(this.player2).toHavePrompt('Honeypot Village');
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.toturi);
            expect(this.player2).not.toBeAbleToSelect(this.yoshi);
            this.player2.clickCard(this.challenger);
            expect(this.challenger.isAttacking()).toBe(true);
            expect(this.getChatLogs(3)).toContain('player2 uses Honeypot Village to move Doji Challenger into the conflict');
        });

        it('should not be usable during a conflict at another province', function() {
            this.noMoreActions();
            this.initiateConflict({
                province: this.pilgrimage,
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.honeypotVillage.facedown = false;
            this.player2.clickCard(this.honeypotVillage);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.challenger.isParticipating()).toBe(false);
        });

        it('should not be usable outside a conflict', function() {
            this.honeypotVillage.facedown = false;
            this.player1.pass();
            this.player2.clickCard(this.honeypotVillage);
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.challenger.isParticipating()).toBe(false);
        });
    });
});
