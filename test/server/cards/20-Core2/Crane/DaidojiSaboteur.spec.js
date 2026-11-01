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

describe('Daidoji Saboteur and Action abilities', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['daidoji-saboteur']
                },
                player2: {
                    inPlay: [{ card: 'agasha-swordsmith', fate: 1 }]
                }
            });
            this.swordsmith = this.player2.findCardByName('agasha-swordsmith');
            this.saboteur = this.player1.playCharacterFromHand('daidoji-saboteur');
        });

        it('triggers when it enters play and stops the chosen character\'s Action for the rest of the phase', function() {
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.saboteur);
            expect(this.player1).toBeAbleToSelect(this.saboteur);
            this.player1.clickCard(this.swordsmith);
            expect(this.getChatLogs(3)).toContain('player1 uses Daidōji Saboteur to prevent Agasha Swordsmith from using any abilities for the rest of the phase');
            expect(this.player2).toHavePrompt('Action Window');
            this.player2.clickCard(this.swordsmith);
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.player2).not.toHavePrompt('Agasha Swordsmith');
        });

        it('lets the chosen character use its Action in the next phase', function() {
            this.player1.clickCard(this.saboteur);
            this.player1.clickCard(this.swordsmith);
            this.player1.togglePromptedActionWindow('fate', true);
            this.player2.togglePromptedActionWindow('fate', true);
            this.flow.finishConflictPhase();
            this.player1.clickPrompt('Done');
            expect(this.game.currentPhase).toBe('fate');
            this.player1.pass();
            this.player2.clickCard(this.swordsmith);
            expect(this.player2).toHavePrompt('Agasha Swordsmith');
            expect(this.getChatLogs(3)).toContain('player2 uses Agasha Swordsmith to look at the top five cards of their deck');
        });
    });
});
