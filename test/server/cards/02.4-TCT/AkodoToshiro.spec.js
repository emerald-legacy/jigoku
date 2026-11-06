describe('Akodo Toshiro', function() {
    integration(function() {
        describe('Akodo Toshiro/Kitsu Spiritcaller interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsu-spiritcaller'],
                        dynastyDiscard: ['akodo-toshiro']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['kitsu-spiritcaller'],
                    defenders: []
                });
                this.player1.player.optionSettings.orderForcedAbilities = true;
                this.player2.pass();
                this.kitsuSpiritcaller = this.player1.clickCard('kitsu-spiritcaller');
                this.akodoToshiro = this.player1.clickCard('akodo-toshiro');
                this.player2.pass();
                this.player1.clickCard(this.akodoToshiro);
            });

            it('should bring Toshiro into play', function() {
                expect(this.akodoToshiro.location).toBe('play area');
            });

            it('should buff Toshiro', function() {
                expect(this.game.currentConflict.attackerSkill).toBe(7);
            });

            it('should not break the province', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('should prompt the player which effect to resolve at the end of the conflict', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Order Simultaneous effects');
            });

            it('should send the character to the discard pile if Toshiro\'s effect is resolved first', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                this.player1.clickPrompt('Akodo Toshiro\'s effect on Akodo Toshiro');
                expect(this.akodoToshiro.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should send the character to the bottom of the dynasty deck if Toshiro\'s effect is resolved first', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                this.player1.clickPrompt('Kitsu Spiritcaller\'s effect on Akodo Toshiro');
                expect(this.player1.player.dynastyDeck.at(-1)).toBe(this.akodoToshiro);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('Akodo Toshiro\'s action', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toshiro', 'siege-captain'],
                        hand: ['seal-of-the-lion']
                    }
                });
                this.akodoToshiro = this.player1.findCardByName('akodo-toshiro');
                this.siegeCaptain = this.player1.findCardByName('siege-captain');
                this.seal = this.player1.findCardByName('seal-of-the-lion');
                this.province = this.player2.findCardByName('shameful-display', 'province 1');
            });

            it('gives him +5 military until the end of the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.akodoToshiro],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoToshiro);
                expect(this.akodoToshiro.militarySkill).toBe(7);
                expect(this.game.currentConflict.attackerSkill).toBe(7);
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.akodoToshiro.location).toBe('play area');
                expect(this.akodoToshiro.militarySkill).toBe(2);
            });

            it('stops the attacked province from being broken', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    province: this.province,
                    attackers: [this.akodoToshiro],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoToshiro);
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player1 won a military conflict 7 vs 0');
                expect(this.province.isBroken).toBe(false);
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('is kept at the end of the conflict while you control a Commander character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.akodoToshiro],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoToshiro);
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.siegeCaptain.isParticipating()).toBe(false);
                expect(this.akodoToshiro.location).toBe('play area');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('is discarded at the end of the conflict without a Commander character', function() {
                this.player1.moveCard(this.siegeCaptain, 'dynasty discard pile');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.akodoToshiro],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoToshiro);
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.akodoToshiro.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('Akodo Toshiro is discarded due to his delayed effect');
            });

            it('is kept when he is a Commander himself through Seal of the Lion', function() {
                this.player1.moveCard(this.siegeCaptain, 'dynasty discard pile');
                this.player1.playAttachment(this.seal, this.akodoToshiro);
                expect(this.akodoToshiro.hasTrait('commander')).toBe(true);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.akodoToshiro],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoToshiro);
                expect(this.akodoToshiro.militarySkill).toBe(8);
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.akodoToshiro.location).toBe('play area');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
