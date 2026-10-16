describe('Steward of Celestial Order', function() {
    integration(function() {
        describe('with claimed rings', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['steward-of-celestial-order', 'doji-whisperer'],
                        rings: ['air', 'fire']
                    },
                    player2: {
                        inPlay: ['doji-challenger']
                    }
                });
                this.steward = this.player1.findCardByName('steward-of-celestial-order');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
            });

            it('should return claimed rings to gain 1 honor for each', function() {
                this.player1.clickCard(this.steward);
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('air');
                this.player1.clickRing('fire');
                expect(this.game.rings.air.claimed).toBe(false);
                expect(this.game.rings.fire.claimed).toBe(false);
                expect(this.player1.honor).toBe(12);
            });

            it('should allow returning only one ring', function() {
                this.player1.clickCard(this.steward);
                this.player1.clickRing('air');
                this.player1.clickPrompt('Done');
                expect(this.game.rings.air.claimed).toBe(false);
                expect(this.game.rings.fire.claimed).toBe(true);
                expect(this.player1.honor).toBe(11);
            });

            it('should contribute its glory while bowed', function() {
                this.steward.bowed = true;
                this.whisperer.bowed = true;
                expect(this.player1.player.getGloryCount()).toBe(2 + 2);
            });
        });

        describe('without claimed rings', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-celestial-order']
                    }
                });
                this.steward = this.player1.findCardByName('steward-of-celestial-order');
            });

            it('should not be usable', function() {
                this.player1.clickCard(this.steward);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
