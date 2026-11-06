describe('Kaito Kosori', function() {
    integration(function() {
        describe('Kaito Kosori\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kaito-kosori', 'seeker-of-knowledge', 'shrine-maiden'],
                        dynastyDeck: ['favorable-ground'],
                        hand: ['seeker-of-knowledge']
                    }
                });
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground');
                this.noMoreActions();
            });

            describe('during an air conflict', function() {
                beforeEach(function() {
                    this.initiateConflict({
                        ring: 'air',
                        attackers: ['shrine-maiden'],
                        defenders: []
                    });
                });

                it('should allow Kosori to contribute when she is at home', function() {
                    expect(this.game.currentConflict.attackerSkill).toBe(3);
                });
            });

            describe('during a fire conflict', function() {
                beforeEach(function() {
                    this.initiateConflict({
                        ring: 'fire',
                        attackers: ['shrine-maiden'],
                        defenders: []
                    });
                });

                it('does not let Kosori contribute during a non-Air conflict', function() {
                    expect(this.game.currentConflict.ring.element).toBe('fire');
                    expect(this.game.currentConflict.attackerSkill).toBe(1);
                });
            });
        });

        describe('Kaito Kosori while bowed', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [{ card: 'kaito-kosori', bowed: true }, 'shrine-maiden']
                    }
                });
                this.kosori = this.player1.findCardByName('kaito-kosori');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    attackers: ['shrine-maiden'],
                    defenders: []
                });
            });

            it('does not let Kosori contribute during an air conflict (ruling #349)', function() {
                expect(this.game.currentConflict.ring.element).toBe('air');
                expect(this.kosori.bowed).toBe(true);
                expect(this.game.currentConflict.attackerSkill).toBe(1);
            });
        });

        describe('Kaito Kosori without a participating character of yours', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrine-maiden']
                    },
                    player2: {
                        inPlay: ['kaito-kosori', 'doji-whisperer']
                    }
                });
                this.maiden = this.player1.findCardByName('shrine-maiden');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.noMoreActions();
            });

            it('does not let Kosori contribute without a participating character of yours', function() {
                this.initiateConflict({
                    ring: 'air',
                    attackers: [this.maiden],
                    defenders: []
                });
                expect(this.game.currentConflict.attackerSkill).toBe(1);
                expect(this.game.currentConflict.defenderSkill).toBe(0);
            });

            it('lets Kosori contribute once a character of yours participates', function() {
                this.initiateConflict({
                    ring: 'air',
                    attackers: [this.maiden],
                    defenders: [this.whisperer]
                });
                expect(this.whisperer.isParticipating()).toBe(true);
                expect(this.game.currentConflict.defenderSkill).toBe(2);
            });
        });
    });
});
