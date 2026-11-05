describe('Unopposed honor loss when the defender cannot lose honor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    honor: 11,
                    inPlay: ['shiba-tsukune']
                },
                player2: {
                    honor: 9,
                    inPlay: ['shrine-maiden'],
                    conflictDiscard: ['divine-ancestry']
                }
            });
            this.shibaTsukune = this.player1.findCardByName('shiba-tsukune');
            this.ancestry = this.player2.findCardByName('divine-ancestry');
            this.player1.player.promptedActionWindows.draw = true;
            this.player2.player.promptedActionWindows.draw = true;
            this.noMoreActions();
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.player2.moveCard(this.ancestry, 'hand');
            this.noMoreActions();
            this.player2.clickCard(this.ancestry);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'earth',
                attackers: [this.shibaTsukune],
                defenders: []
            });
            this.noMoreActions();
        });

        it('posts no honor loss line and keeps the honor', function() {
            expect(this.getChatLogs(8)).toContain('player2 does not defend the conflict');
            expect(this.getChatLogs(8)).not.toContain('player2 loses 1 honor for not defending the conflict');
            expect(this.player2.honor).toBe(9);
        });
    });
});
