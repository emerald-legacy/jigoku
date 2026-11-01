describe('Yōjin no Shiro', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    stronghold: 'yojin-no-shiro',
                    inPlay: ['matsu-berserker', 'akodo-gunso', 'shinjo-outrider', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['shiba-peacemaker', 'brash-samurai']
                }
            });
            this.shiro = this.player1.findCardByName('yojin-no-shiro');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
            this.brash = this.player2.findCardByName('brash-samurai');
        });

        it('bows to give each attacking character you control +1 military', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker, this.gunso],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            this.player1.clickCard(this.shiro);
            expect(this.shiro.bowed).toBe(true);
            expect(this.berserker.militarySkill).toBe(4);
            expect(this.gunso.militarySkill).toBe(3);
            expect(this.gunso.politicalSkill).toBe(1);
            expect(this.outrider.militarySkill).toBe(2);
            expect(this.whisperer.militarySkill).toBe(0);
            expect(this.peacemaker.militarySkill).toBe(4);
        });

        it('does not affect a character that joins the attack after it resolved (ruling #131)', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker, this.gunso],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            this.player1.clickCard(this.shiro);
            this.player2.pass();
            this.player1.clickCard(this.outrider);
            expect(this.outrider.isAttacking()).toBe(true);
            expect(this.outrider.militarySkill).toBe(2);
            expect(this.berserker.militarySkill).toBe(4);
        });

        it('cannot be triggered while you are defending, as it would change nothing (ruling #141)', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.berserker]
            });
            expect(this.berserker.isDefending()).toBe(true);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.shiro);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.shiro.bowed).toBe(false);
            expect(this.berserker.militarySkill).toBe(3);
        });

        it('lasts until the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            this.player1.clickCard(this.shiro);
            expect(this.whisperer.militarySkill).toBe(1);
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 4 vs 1');
            expect(this.whisperer.militarySkill).toBe(0);
        });

        it('cannot be used outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.shiro);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.shiro.bowed).toBe(false);
        });
    });
});
