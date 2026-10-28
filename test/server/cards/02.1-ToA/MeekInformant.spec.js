describe('Meek Informant', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['kitsu-spiritcaller', 'brash-samurai'],
                    hand: ['meek-informant'],
                    conflictDiscard: ['meek-informant']
                },
                player2: {
                    hand: ['banzai', 'assassination']
                }
            });
            this.spiritcaller = this.player1.findCardByName('kitsu-spiritcaller');
            this.handInformant = this.player1.findCardByName('meek-informant', 'hand');
            this.discardInformant = this.player1.findCardByName('meek-informant', 'conflict discard pile');
        });

        it('looks at the opponent\'s hand after you play it', function() {
            this.player1.playCharacterFromHand(this.handInformant);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.handInformant);
            this.player1.clickCard(this.handInformant);
            expect(this.getChatLogs(5)).toContain('player1 uses Meek Informant to look at player2\'s hand');
            expect(this.getChatLogs(5)).toContain('Meek Informant sees Assassination and Banzai!');
        });

        // ruling #553: putting it into play by a card effect does not trigger it
        it('does not trigger when it is put into play by a card effect', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: ['brash-samurai'],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.spiritcaller);
            this.player1.clickCard(this.discardInformant);
            expect(this.discardInformant.location).toBe('play area');
            expect(this.discardInformant.isParticipating()).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Kitsu Spiritcaller, bowing Kitsu Spiritcaller to call Meek Informant back from the dead until the end of the conflict');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.getChatLogs(5)).not.toContain('Meek Informant sees Assassination and Banzai!');
        });
    });
});
