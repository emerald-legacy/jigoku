describe('Tranquil Philosopher', function() {
    integration(function() {
        describe('Tranquil Philosopher\'s Ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['tranquil-philosopher']
                    },
                    player2: { }
                });
                this.tranquilPhilosopher = this.player1.findCardByName('tranquil-philosopher');
                this.player2.claimRing('water');
                this.game.rings.air.fate = 2;
                this.game.rings.earth.fate = 1;
                this.game.rings.fire.fate = 0;
                this.game.rings.void.fate = 1;
                this.game.rings.water.fate = 2;
            });

            it('should prompt to choose an unclaimed ring', function() {
                this.player1.clickCard(this.tranquilPhilosopher);
                expect(this.player1).toHavePrompt('Choose an unclaimed ring to move fate from');
                expect(this.player1).toBeAbleToSelectRing('air');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).not.toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('void');
                expect(this.player1).not.toBeAbleToSelectRing('water');
            });

            it('should prompt to choose an unclaimed ring to move fate to', function() {
                this.player1.clickCard(this.tranquilPhilosopher);
                this.player1.clickRing('air');
                expect(this.player1).toHavePrompt('Choose an unclaimed ring to move fate to');
                expect(this.player1).not.toBeAbleToSelectRing('air');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('void');
                expect(this.player1).not.toBeAbleToSelectRing('water');
            });

            it('should move 1 fate', function() {
                this.player1.clickCard(this.tranquilPhilosopher);
                const airFate = this.game.rings.air.fate;
                const voidFate = this.game.rings.void.fate;
                this.player1.clickRing('air');
                this.player1.clickRing('void');
                expect(this.game.rings.air.fate).toBe(airFate - 1);
                expect(this.game.rings.void.fate).toBe(voidFate + 1);
            });

            it('should then give you 1 honor', function() {
                this.player1.clickCard(this.tranquilPhilosopher);
                this.player1.clickRing('air');
                const honor = this.player1.player.honor;
                this.player1.clickRing('void');
                expect(this.player1.player.honor).toBe(honor + 1);
                expect(this.getChatLogs(3)).toContain('player1 uses Tranquil Philosopher to move 1 fate from the Air Ring to an unclaimed ring, then gain 1 honor');
                expect(this.getChatLogs(3)).toContain('player1 moves a fate from the Air Ring to the Void Ring');
            });

            it('cannot be used when no unclaimed ring has fate', function() {
                this.game.rings.air.fate = 0;
                this.game.rings.earth.fate = 0;
                this.game.rings.void.fate = 0;
                this.player1.clickCard(this.tranquilPhilosopher);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
