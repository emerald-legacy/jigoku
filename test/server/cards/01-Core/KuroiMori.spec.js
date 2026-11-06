describe('Kuroi Mori', function() {
    integration(function() {
        describe('Kuroi Mori\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        rings: ['water'],
                        inPlay: ['samurai-of-integrity', 'matsu-berserker']
                    },
                    player2: {
                        provinces: ['kuroi-mori'],
                        inPlay: ['doji-whisperer']
                    }
                });
                this.samurai = this.player1.findCardByName('samurai-of-integrity');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.kuroiMori = this.player2.findCardByName('kuroi-mori', 'province 1');
                this.otherProvince = this.player2.findCardByName('shameful-display', 'province 2');
                this.noMoreActions();
            });

            it('switches the conflict type, keeping the element, and sends characters with a dash in the new type home bowed (ruling #71)', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: this.kuroiMori,
                    attackers: [this.samurai, this.berserker],
                    defenders: []
                });
                expect(this.berserker.isAttacking()).toBe(true);
                expect(this.berserker.bowed).toBe(false);
                this.player2.clickCard(this.kuroiMori);
                expect(this.player2).toHavePromptButton('Switch the contested ring');
                expect(this.player2).toHavePromptButton('Switch the conflict type');
                this.player2.clickPrompt('Switch the conflict type');
                expect(this.game.currentConflict.conflictType).toBe('political');
                expect(this.game.currentConflict.ring.element).toBe('air');
                expect(this.berserker.isParticipating()).toBe(false);
                expect(this.berserker.bowed).toBe(true);
                expect(this.samurai.isAttacking()).toBe(true);
                expect(this.samurai.bowed).toBe(false);
            });

            it('switches the contested ring with an unclaimed ring, keeping the conflict type, and the attacker takes its fate (ruling #72)', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: this.kuroiMori,
                    attackers: [this.samurai],
                    defenders: []
                });
                this.game.rings.fire.fate = 2;
                this.player2.clickCard(this.kuroiMori);
                this.player2.clickPrompt('Switch the contested ring');
                expect(this.player2).toHavePrompt('Choose a ring to switch with the contested ring');
                expect(this.player2).toBeAbleToSelectRing('fire');
                expect(this.player2).toBeAbleToSelectRing('earth');
                expect(this.player2).not.toBeAbleToSelectRing('water');
                this.player2.clickRing('fire');
                expect(this.game.currentConflict.ring.element).toBe('fire');
                expect(this.game.currentConflict.conflictType).toBe('military');
                expect(this.game.rings.fire.fate).toBe(0);
                expect(this.player1.fate).toBe(7);
            });

            it('cannot be used during a conflict at another province', function() {
                this.kuroiMori.facedown = false;
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: this.otherProvince,
                    attackers: [this.samurai, this.berserker],
                    defenders: []
                });
                this.player2.clickCard(this.kuroiMori);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.game.currentConflict.conflictType).toBe('military');
                expect(this.berserker.isAttacking()).toBe(true);
            });
        });

        describe('during setup', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'setup',
                    player1: {
                        provinces: ['kuroi-mori']
                    },
                    skipAutoSetup: true
                });
                this.kuroiMori = this.player1.findCardByName('kuroi-mori');
                this.shamefulDisplay = this.player1.findCardByName('shameful-display');
                this.selectFirstPlayer(this.player1);
            });

            it('cannot be chosen as the stronghold province', function() {
                expect(this.player1).toHavePrompt('Select stronghold province');
                expect(this.player1).not.toBeAbleToSelect(this.kuroiMori);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay);
                this.player1.clickCard(this.kuroiMori);
                expect(this.player1).toHavePrompt('Select stronghold province');
                expect(this.kuroiMori.location).toBe('province deck');
            });
        });
    });
});
