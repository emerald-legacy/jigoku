describe('Daidoji Saboteur', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['miya-mystic'],
                    hand: ['daidoji-saboteur']
                },
                player2: {
                    inPlay: ['hida-amoro']
                }
            });
            this.mystic = this.player1.findCardByName('miya-mystic');
            this.amoro = this.player2.findCardByName('hida-amoro');
            this.saboteur = this.player1.playCharacterFromHand('daidoji-saboteur');
        });

        // Forced abilities are triggered by the game (rulings #778, #810, #942)
        it('should not stop a Forced Reaction of the chosen character', function () {
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.saboteur);
            this.player1.clickCard(this.amoro);
            expect(this.getChatLogs(3)).toContain('player1 uses Daidōji Saboteur to prevent Hida Amoro from using any abilities for the rest of the phase');

            this.noMoreActions();
            this.player1.clickPrompt('Pass Conflict');
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Hida Amoro');
            expect(this.player1).toBeAbleToSelect(this.mystic);
        });

        it('should let the Forced Reaction resolve when another character was chosen', function () {
            this.player1.clickCard(this.saboteur);
            this.player1.clickCard(this.mystic);
            this.noMoreActions();
            this.player1.clickPrompt('Pass Conflict');
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Hida Amoro');
            expect(this.player1).toBeAbleToSelect(this.mystic);
        });
    });
});
