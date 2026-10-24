describe('Shiro Nishiyama', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    stronghold: 'shiro-nishiyama',
                    inPlay: ['akodo-gunso', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['matsu-berserker']
                }
            });
            this.shiro = this.player1.findCardByName('shiro-nishiyama');
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player2.findCardByName('matsu-berserker');
        });

        it('should give each defending character you control +1/+1', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.gunso]
            });
            this.player1.clickCard(this.shiro);
            expect(this.shiro.bowed).toBe(true);
            expect(this.gunso.militarySkill).toBe(3);
            expect(this.gunso.politicalSkill).toBe(2);
            expect(this.whisperer.militarySkill).toBe(0);
            expect(this.whisperer.politicalSkill).toBe(3);
            expect(this.berserker.militarySkill).toBe(3);
            expect(this.getChatLogs(3)).toContain('player1 uses Shiro Nishiyama, bowing Shiro Nishiyama to add +1military/+1political to all defenders they control');
        });

        it('should not be usable outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.shiro);
            expect(this.shiro.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
