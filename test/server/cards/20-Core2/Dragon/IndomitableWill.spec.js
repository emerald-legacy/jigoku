describe('Indomitable Will', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-toturi', 'brash-samurai'],
                    hand: ['indomitable-will']
                },
                player2: {
                    inPlay: ['kakita-asami']
                }
            });

            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.indomitableWill = this.player1.findCardByName('indomitable-will');
            this.asami = this.player2.findCardByName('kakita-asami');
        });

        it('should stop the character that won alone from bowing at the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [this.asami]
            });
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.indomitableWill);
            this.player1.clickCard(this.indomitableWill);
            expect(this.getChatLogs(5)).toContain('player1 plays Indomitable Will to prevent Akodo Toturi from bowing as a result of the conflict\'s resolution');
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Gain 2 honor');
            this.player1.clickPrompt('Pass');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.toturi.bowed).toBe(false);
            expect(this.asami.bowed).toBe(true);
        });

        it('should not trigger when more than one of your characters won the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi, this.brashSamurai],
                defenders: [this.asami]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 8 vs 1');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should not trigger when your character loses alone', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.asami.bowed = false;
            this.initiateConflict({
                type: 'political',
                attackers: [this.asami],
                defenders: [this.brashSamurai]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a political conflict 3 vs 1');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
