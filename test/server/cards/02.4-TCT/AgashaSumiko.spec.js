describe('Agasha Sumiko', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['agasha-sumiko', 'brash-samurai']
                },
                player2: {
                    inPlay: ['matsu-berserker']
                }
            });
            this.sumiko = this.player1.findCardByName('agasha-sumiko');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.berserker = this.player2.findCardByName('matsu-berserker');
        });

        it('does not bow after an attacking conflict while you have the Imperial Favor', function() {
            // set directly: claiming the favor needs a full glory count
            this.player1.player.imperialFavor = 'military';
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.sumiko, this.brash],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Gain 2 Honor');
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 7 vs 0');
            expect(this.sumiko.bowed).toBe(false);
            expect(this.brash.bowed).toBe(true);
        });

        it('bows after an attacking conflict when you do not have the Imperial Favor', function() {
            this.player2.player.imperialFavor = 'military';
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.sumiko],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Gain 2 Honor');
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 4 vs 0');
            expect(this.sumiko.bowed).toBe(true);
        });

        it('bows after a conflict it defends even while you have the Imperial Favor', function() {
            this.player1.player.imperialFavor = 'military';
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.sumiko]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 5 vs 3');
            expect(this.sumiko.bowed).toBe(true);
        });
    });
});
