describe('Demonstrating Excellence', function() {
    integration(function() {
        describe('Demonstrating Excellence\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-horde', 'moto-horde', 'moto-horde']
                    },
                    player2: {
                        fate: 3,
                        provinces: ['demonstrating-excellence']
                    }
                });
                this.demonstratingExcellence = this.player2.findCardByName('demonstrating-excellence');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['moto-horde', 'moto-horde', 'moto-horde'],
                    defenders: []
                });
            });

            it('should work properly', function() {
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('demonstrating-excellence');
                this.demonstratingExcellence = this.player2.clickCard('demonstrating-excellence');
                expect(this.player1).toHavePrompt('Break Demonstrating Excellence');
                expect(this.player2.fate).toBe(4);
                expect(this.player2.hand.length).toBe(1);
                expect(this.demonstratingExcellence.isBroken).toBe(true);
            });
        });
    });
});

describe('Demonstrating Excellence\'s strength', function() {
    integration(function() {
        describe('while you have an Air role', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player2: {
                        role: 'seeker-of-air',
                        provinces: ['demonstrating-excellence']
                    }
                });
                this.demonstratingExcellence = this.player2.findCardByName('demonstrating-excellence');
                this.demonstratingExcellence.facedown = false;
                this.game.checkGameState(true);
            });

            it('gets +2 strength', function() {
                expect(this.player2.player.role.hasTrait('air')).toBe(true);
                expect(this.demonstratingExcellence.getStrength()).toBe(5);
            });
        });

        describe('while you have a non-Air role', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player2: {
                        role: 'keeper-of-water',
                        provinces: ['demonstrating-excellence']
                    }
                });
                this.demonstratingExcellence = this.player2.findCardByName('demonstrating-excellence');
                this.demonstratingExcellence.facedown = false;
                this.game.checkGameState(true);
            });

            it('keeps its printed strength', function() {
                expect(this.player2.player.role.hasTrait('water')).toBe(true);
                expect(this.demonstratingExcellence.getStrength()).toBe(3);
            });
        });

        describe('while only your opponent has an Air role', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        role: 'seeker-of-air'
                    },
                    player2: {
                        role: 'keeper-of-water',
                        provinces: ['demonstrating-excellence']
                    }
                });
                this.demonstratingExcellence = this.player2.findCardByName('demonstrating-excellence');
                this.demonstratingExcellence.facedown = false;
                this.game.checkGameState(true);
            });

            it('does not get +2 strength from the opponent\'s Air role', function() {
                expect(this.player1.player.role.hasTrait('air')).toBe(true);
                expect(this.demonstratingExcellence.getStrength()).toBe(3);
            });
        });
    });
});
