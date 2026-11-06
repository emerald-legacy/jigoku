describe('Enlightened Warrior 2', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger']
                },
                player2: {
                    inPlay: ['enlightened-warrior-2', 'brash-samurai']
                }
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.enlightenedWarrior = this.player2.findCardByName('enlightened-warrior-2');
            this.brashSamurai = this.player2.findCardByName('brash-samurai');

            this.game.rings.water.fate = 1;
            this.game.rings.earth.fate = 1;
            this.enlightenedWarrior.fate = 0;
        });

        it('should place 1 fate on itself when an opponent selects a ring with fate on it', function() {
            this.noMoreActions();
            this.initiateConflict({
                ring: 'water',
                attackers: [this.challenger]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.enlightenedWarrior);
            this.player2.clickCard(this.enlightenedWarrior);
            expect(this.enlightenedWarrior.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain('player2 uses Enlightened Warrior to place 1 fate on Enlightened Warrior');
        });

        it('should not trigger when an opponent selects a ring without fate', function() {
            this.noMoreActions();
            this.initiateConflict({
                ring: 'fire',
                attackers: [this.challenger]
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.enlightenedWarrior.fate).toBe(0);
        });

        it('should not trigger when its controller selects a ring with fate on it', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                ring: 'earth',
                attackers: [this.brashSamurai]
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Choose defenders');
            expect(this.enlightenedWarrior.fate).toBe(0);
        });
    });
});
