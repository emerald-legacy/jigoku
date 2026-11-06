describe('Fallen in Battle', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['hida-kisada', 'kakita-yoshi'],
                    hand: ['fallen-in-battle', 'fallen-in-battle']
                },
                player2: {
                    honor: 10,
                    inPlay: ['brash-samurai', 'doji-whisperer', 'steward-of-law', 'moto-horde'],
                    provinces: ['untamed-steppe']
                }
            });
            this.kisada = this.player1.findCardByName('hida-kisada');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            const fallen = this.player1.filterCardsByName('fallen-in-battle');
            this.fallen1 = fallen[0];
            this.fallen2 = fallen[1];
            this.brash = this.player2.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.steward = this.player2.findCardByName('steward-of-law');
            this.horde = this.player2.findCardByName('moto-horde');
            this.untamedSteppe = this.player2.findCardByName('untamed-steppe');
            this.noMoreActions();
        });

        it('discards a participating character after you win a military conflict by 5 or more', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.kisada],
                defenders: [this.brash]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 7 vs 2');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.fallen1);
            this.player1.clickCard(this.fallen1);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).toBeAbleToSelect(this.kisada);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.brash);
            expect(this.brash.location).toBe('dynasty discard pile');
            expect(this.fallen1.location).toBe('conflict discard pile');
        });

        it('does not make the conflict unopposed or break the province, as the skill difference is fixed (ruling #43)', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.kisada],
                defenders: [this.brash]
            });
            this.noMoreActions();
            this.player1.clickCard(this.fallen1);
            this.player1.clickCard(this.brash);
            expect(this.brash.location).toBe('dynasty discard pile');
            expect(this.player1).toHavePrompt('Air Ring');
            expect(this.untamedSteppe.isBroken).toBe(false);
            expect(this.player2.honor).toBe(10);
            expect(this.game.currentConflict.conflictUnopposed).toBe(false);
        });

        it('can be played only once per conflict (Max 1 per conflict)', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.kisada],
                defenders: [this.brash, this.whisperer]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 7 vs 2');
            this.player1.clickCard(this.fallen1);
            this.player1.clickCard(this.brash);
            expect(this.brash.location).toBe('dynasty discard pile');
            expect(this.whisperer.isParticipating()).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.fallen2);
            expect(this.player1).toHavePrompt('Air Ring');
            expect(this.fallen2.location).toBe('hand');
        });

        it('is not offered after a military win by 4', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.kisada],
                defenders: [this.brash, this.steward]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 7 vs 3');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.fallen1);
            expect(this.player1).toHavePrompt('Air Ring');
        });

        it('is not offered after a political win by 5', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                attackers: [this.yoshi],
                defenders: [this.brash]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 6 vs 1');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.fallen1);
            expect(this.player1).toHavePrompt('Air Ring');
        });

        it('is not offered after you lose a military conflict by 5 or more', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.yoshi],
                defenders: [this.horde, this.brash]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 8 vs 2');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.fallen1);
            expect(this.fallen1.location).toBe('hand');
        });
    });
});
