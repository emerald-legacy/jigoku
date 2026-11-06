describe('Elemental Fury', function() {
    integration(function() {
        describe('during a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        inPlay: ['brash-samurai']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        provinces: ['elemental-fury'],
                        rings: ['earth']
                    }
                });
                this.brash = this.player1.findCardByName('brash-samurai');
                this.elementalFury = this.player2.findCardByName('elemental-fury');
                this.game.rings.fire.fate = 2;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'air',
                    province: this.elementalFury,
                    attackers: [this.brash]
                });
            });

            it('switches the contested ring with an unclaimed ring after it is revealed', function() {
                expect(this.elementalFury.facedown).toBe(false);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.elementalFury);
                this.player2.clickCard(this.elementalFury);
                expect(this.player2).toBeAbleToSelectRing('fire');
                expect(this.player2).toBeAbleToSelectRing('water');
                expect(this.player2).not.toBeAbleToSelectRing('air');
                expect(this.player2).not.toBeAbleToSelectRing('earth');
                this.player2.clickRing('fire');
                expect(this.game.currentConflict.ring).toBe(this.game.rings.fire);
                expect(this.game.rings.fire.contested).toBe(true);
                expect(this.game.rings.air.contested).toBe(false);
                expect(this.game.rings.air.claimed).toBe(false);
            });

            it('keeps the conflict type', function() {
                this.player2.clickCard(this.elementalFury);
                this.player2.clickRing('fire');
                expect(this.game.currentConflict.conflictType).toBe('political');
                expect(this.game.rings.fire.conflictType).toBe('political');
            });

            it('gives the attacking player the fate on the new contested ring (ruling #39)', function() {
                expect(this.player1.fate).toBe(5);
                this.player2.clickCard(this.elementalFury);
                this.player2.clickRing('fire');
                expect(this.game.rings.fire.fate).toBe(0);
                expect(this.player1.fate).toBe(7);
            });

            it('does not change the ring declared for the conflict (ruling #888)', function() {
                this.player2.clickCard(this.elementalFury);
                this.player2.clickRing('fire');
                expect(this.game.currentConflict.ring).toBe(this.game.rings.fire);
                expect(this.game.currentConflict.declaredRing).toBe(this.game.rings.air);
            });
        });

        describe('outside a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 10,
                        dynastyDiscard: ['iuchi-farseer']
                    },
                    player2: {
                        provinces: ['elemental-fury']
                    }
                });
                this.farseer = this.player1.placeCardInProvince('iuchi-farseer', 'province 1');
                this.elementalFury = this.player2.findCardByName('elemental-fury');
            });

            it('does not trigger when it is revealed', function() {
                this.player1.clickCard(this.farseer);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.farseer);
                this.player1.clickCard(this.elementalFury);
                expect(this.elementalFury.facedown).toBe(false);
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.elementalFury);
                expect(this.player2).toHavePrompt('Click pass when done');
            });
        });
    });
});
