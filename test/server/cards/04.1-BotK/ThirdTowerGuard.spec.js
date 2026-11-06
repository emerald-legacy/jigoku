describe('Third Tower Guard', function() {
    integration(function() {
        describe('Third Tower Guard\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['third-tower-guard'],
                        provinces: ['entrenched-position']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.thirdTowerGuard = this.player1.findCardByName('third-tower-guard');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('should give +2 military skill if you have claimed the earth ring', function() {
                expect(this.thirdTowerGuard.militarySkill).toBe(1);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.thirdTowerGuard],
                    defenders: [],
                    ring: 'earth',
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.rings.earth.claimedBy).toBe(this.player1.player.name);
                expect(this.thirdTowerGuard.militarySkill).toBe(3);
            });

            it('should give +2 military skill if you have claimed the water ring', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.thirdTowerGuard],
                    defenders: [],
                    ring: 'water',
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.rings.water.claimedBy).toBe(this.player1.player.name);
                expect(this.thirdTowerGuard.militarySkill).toBe(3);
            });

            it('should not give the bonus if you have claimed another ring', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.thirdTowerGuard],
                    defenders: [],
                    ring: 'fire',
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.rings.fire.claimedBy).toBe(this.player1.player.name);
                expect(this.thirdTowerGuard.militarySkill).toBe(1);
            });

            it('should not give the bonus if your opponent has claimed the earth ring', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    province: 'entrenched-position',
                    attackers: [this.whisperer],
                    defenders: [],
                    ring: 'earth',
                    jumpTo: 'afterConflict'
                });
                this.player2.clickPrompt('Don\'t resolve');
                expect(this.game.rings.earth.claimedBy).toBe(this.player2.player.name);
                expect(this.thirdTowerGuard.militarySkill).toBe(1);
            });
        });
    });
});
