describe('Seppun Guardsman', function() {
    integration(function() {
        describe('Seppun Guardsman as an attacker', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['seppun-guardsman', 'border-rider']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        provinces: ['rally-to-the-cause', 'entrenched-position']
                    }
                });
                this.guardsman = this.player1.findCardByName('seppun-guardsman');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.rally = this.player2.findCardByName('rally-to-the-cause');
                this.entrenched = this.player2.findCardByName('entrenched-position');
                this.game.rings.air.conflictType = 'military';
            });

            it('cannot be declared as an attacker against a player that controls the Imperial Favor', function() {
                this.player2.player.imperialFavor = 'military';
                this.noMoreActions();
                this.player1.clickRing('air');
                this.player1.clickCard(this.entrenched);
                expect(this.game.currentConflict.conflictType).toBe('military');
                this.player1.clickCard(this.guardsman);
                this.player1.clickCard(this.borderRider);
                expect(this.guardsman.inConflict).toBe(false);
                expect(this.borderRider.inConflict).toBe(true);
            });

            it('can attack while you control the Imperial Favor', function() {
                this.player1.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: this.entrenched,
                    attackers: [this.guardsman],
                    defenders: []
                });
                expect(this.guardsman.isAttacking()).toBe(true);
            });

            it('goes home bowed when the conflict type is switched to political (ruling #179)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: this.rally,
                    attackers: [this.guardsman, this.borderRider]
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.rally);
                expect(this.game.currentConflict.conflictType).toBe('political');
                expect(this.guardsman.isParticipating()).toBe(false);
                expect(this.guardsman.bowed).toBe(true);
                expect(this.borderRider.isAttacking()).toBe(true);
            });
        });

        describe('Seppun Guardsman taken by Blackmail', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['border-rider'],
                        hand: ['blackmail']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['seppun-guardsman', 'doji-whisperer'],
                        provinces: ['entrenched-position']
                    }
                });
                this.borderRider = this.player1.findCardByName('border-rider');
                this.guardsman = this.player2.findCardByName('seppun-guardsman');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.player2.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: 'entrenched-position',
                    attackers: [this.borderRider],
                    defenders: [this.guardsman, this.whisperer]
                });
                this.player2.pass();
            });

            it('goes home bowed when it becomes an attacker against a player that controls the Imperial Favor (ruling #179)', function() {
                expect(this.guardsman.isDefending()).toBe(true);
                this.player1.clickCard('blackmail');
                this.player1.clickCard(this.guardsman);
                expect(this.guardsman.controller).toBe(this.player1.player);
                expect(this.guardsman.isParticipating()).toBe(false);
                expect(this.guardsman.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain('Seppun Guardsman cannot participate in the conflict any more and is sent home bowed');
            });
        });
    });
});
