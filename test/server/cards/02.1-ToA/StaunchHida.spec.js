describe('Staunch Hida', function() {
    integration(function() {
        describe('Staunch Hida\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['miya-mystic', 'matsu-berserker']
                    },
                    player2: {
                        honor: 10,
                        inPlay: ['staunch-hida', 'staunch-hida'],
                        provinces: ['defend-the-wall']
                    }
                });
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                [this.staunchHida, this.staunchHida2] = this.player2.filterCardsByName('staunch-hida');
                this.defendTheWall = this.player2.findCardByName('defend-the-wall');
                this.otherProvince = this.player2.player.getProvinceCardInProvince('province 2');
                this.noMoreActions();
            });

            it('resolves the ring effect for its controller after it wins a conflict as a defender', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: this.otherProvince,
                    attackers: [this.miyaMystic],
                    defenders: [this.staunchHida]
                });
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.staunchHida);
                this.player2.clickCard(this.staunchHida);
                expect(this.player2).toHavePromptButton('Gain 2 Honor');
                this.player2.clickPrompt('Gain 2 Honor');
                expect(this.player2.honor).toBe(12);
                expect(this.player1.honor).toBe(10);
            });

            it('does not trigger after it loses a conflict as a defender', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: this.otherProvince,
                    attackers: [this.miyaMystic, this.berserker],
                    defenders: [this.staunchHida]
                });
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player1 won a military conflict 4 vs 2');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2.honor).toBe(10);
            });

            it('does not trigger after it wins a conflict as an attacker', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: [this.staunchHida],
                    defenders: [this.miyaMystic]
                });
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player2 won a military conflict 2 vs 1');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Air Ring');
            });

            it('can be used only once per conflict (max 1 per conflict)', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: this.otherProvince,
                    attackers: [this.miyaMystic],
                    defenders: [this.staunchHida, this.staunchHida2]
                });
                this.noMoreActions();
                expect(this.player2).toBeAbleToSelect(this.staunchHida);
                expect(this.player2).toBeAbleToSelect(this.staunchHida2);
                this.player2.clickCard(this.staunchHida);
                this.player2.clickPrompt('Gain 2 Honor');
                expect(this.player2.honor).toBe(12);
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
            });

            // ruling #251
            it('lets the ring effect resolve twice at Defend the Wall', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: this.defendTheWall,
                    attackers: [this.miyaMystic],
                    defenders: [this.staunchHida]
                });
                this.noMoreActions();
                expect(this.player2).toBeAbleToSelect(this.staunchHida);
                expect(this.player2).toBeAbleToSelect(this.defendTheWall);
                this.player2.clickCard(this.staunchHida);
                this.player2.clickPrompt('Gain 2 Honor');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.defendTheWall);
                this.player2.clickPrompt('Gain 2 Honor');
                expect(this.player2.honor).toBe(14);
            });
        });
    });
});
