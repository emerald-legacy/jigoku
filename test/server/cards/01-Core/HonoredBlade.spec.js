describe('Honored Blade', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    stronghold: 'hisu-mori-toride-unicorn',
                    inPlay: ['aggressive-moto', 'border-rider', 'ide-trader'],
                    hand: ['honored-blade']
                },
                player2: {
                    inPlay: ['hida-guardian']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.borderRider = this.player1.findCardByName('border-rider');
            this.ideTrader = this.player1.findCardByName('ide-trader');
            this.blade = this.player1.findCardByName('honored-blade');
            this.hmt = this.player1.findCardByName('hisu-mori-toride-unicorn');

            this.hidaGuardian = this.player2.findCardByName('hida-guardian');

            this.player1.playAttachment(this.blade, this.borderRider);
            this.noMoreActions();
        });

        it('should not react if you sac the parent during resolution', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.aggressiveMoto, this.borderRider],
                defenders: [this.hidaGuardian]
            });
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.blade);
            expect(this.player1).toBeAbleToSelect(this.hmt);
            this.player1.clickCard(this.hmt);
            this.player1.clickCard(this.borderRider);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.blade);
        });

        it('gains 1 honor after the attached character wins a conflict', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.borderRider],
                defenders: []
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 1 vs 0');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.blade);
            this.player1.clickCard(this.blade);
            expect(this.player1.honor).toBe(11);
        });

        it('does not react when its side wins a conflict the attached character is not participating in', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.ideTrader],
                defenders: []
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 3 vs 0');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.borderRider.isParticipating()).toBe(false);
        });
    });
});
