describe('Defend the Wall', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'isawa-kaede', { card: 'matsu-berserker', fate: 1 }]
                },
                player2: {
                    honor: 10,
                    inPlay: ['moto-horde', 'doji-whisperer'],
                    provinces: ['defend-the-wall']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.kaede = this.player1.findCardByName('isawa-kaede');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.horde = this.player2.findCardByName('moto-horde');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.defendTheWall = this.player2.findCardByName('defend-the-wall');
            this.otherProvince = this.player2.findCardByName('shameful-display', 'province 2');
            this.noMoreActions();
        });

        it('resolves the ring effect as the attacking player after you win a conflict at this province', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                province: this.defendTheWall,
                attackers: [this.brash],
                defenders: [this.horde]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 6 vs 2');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.defendTheWall);
            this.player2.clickCard(this.defendTheWall);
            expect(this.player2).toHavePrompt('Air Ring');
            this.player2.clickPrompt('Gain 2 honor');
            expect(this.player2.honor).toBe(12);
        });

        it('lets you choose which element of a multi-element ring to resolve, as the attacker would', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                province: this.defendTheWall,
                attackers: [this.kaede],
                defenders: [this.horde]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 6 vs 3');
            this.player2.clickCard(this.defendTheWall);
            expect(this.player2).toHavePrompt('Choose a ring effect to resolve (click the ring you want to resolve)');
            this.player2.clickRing('void');
            expect(this.player2).toBeAbleToSelect(this.berserker);
            this.player2.clickCard(this.berserker);
            expect(this.berserker.fate).toBe(0);
            expect(this.player2).not.toHavePrompt('Fire Ring');
        });

        it('does not trigger when you lose the conflict at this province', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                province: this.defendTheWall,
                attackers: [this.brash],
                defenders: [this.whisperer]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 2 vs 0');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toBeAbleToSelect(this.defendTheWall);
            expect(this.player1).toHavePrompt('Air Ring');
        });

        it('does not trigger when you win a conflict at another province', function() {
            this.defendTheWall.facedown = false;
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                province: this.otherProvince,
                attackers: [this.brash],
                defenders: [this.horde]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 6 vs 2');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toBeAbleToSelect(this.defendTheWall);
            expect(this.player2.honor).toBe(10);
        });
    });
});
