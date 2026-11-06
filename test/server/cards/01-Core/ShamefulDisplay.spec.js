describe('Shameful Display', function() {
    integration(function() {
        describe('Shameful Display\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider', 'aggressive-moto']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'kakita-yoshi'],
                        provinces: ['shameful-display', 'entrenched-position']
                    }
                });

                this.borderRider = this.player1.findCardByName('border-rider');
                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.yoshi = this.player2.findCardByName('kakita-yoshi');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.entrenchedPosition = this.player2.findCardByName('entrenched-position', 'province 2');
                this.shamefulDisplay.facedown = false;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.borderRider, this.aggressiveMoto],
                    defenders: [this.whisperer, this.yoshi],
                    province: this.shamefulDisplay
                });
            });

            it('should prompt for exactly 2 participating characters', function() {
                this.player2.clickCard(this.shamefulDisplay);
                expect(this.player2).toHavePrompt('Shameful Display');
                expect(this.player2).toBeAbleToSelect(this.borderRider);
                expect(this.player2).toBeAbleToSelect(this.aggressiveMoto);
                expect(this.player2).toBeAbleToSelect(this.whisperer);
                expect(this.player2).toBeAbleToSelect(this.yoshi);
            });

            it('should let the player choose which character to honor and which to dishonor', function() {
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickCard(this.borderRider);
                this.player2.clickCard(this.whisperer);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Choose a character to:');
                expect(this.player2).toHavePromptButton('Honor');
                expect(this.player2).toHavePromptButton('Dishonor');
                this.player2.clickPrompt('Honor');
                this.player2.clickCard(this.whisperer);
                expect(this.whisperer.isHonored).toBe(true);
                expect(this.borderRider.isDishonored).toBe(true);
            });

            it('should allow honoring the attacker and dishonoring the defender', function() {
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickCard(this.borderRider);
                this.player2.clickCard(this.whisperer);
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('Dishonor');
                this.player2.clickCard(this.whisperer);
                expect(this.whisperer.isDishonored).toBe(true);
                expect(this.borderRider.isHonored).toBe(true);
            });

            it('should skip the Honor/Dishonor menu when both targets are already honored', function() {
                this.borderRider.honor();
                this.whisperer.honor();
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickCard(this.borderRider);
                this.player2.clickCard(this.whisperer);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Choose a character to dishonor');
                this.player2.clickCard(this.whisperer);
                expect(this.whisperer.isHonored).toBe(false);
                expect(this.borderRider.isHonored).toBe(true);
            });
            it('should go back to the Honor/Dishonor menu', function() {
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickCard(this.borderRider);
                this.player2.clickCard(this.whisperer);
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('Honor');
                expect(this.player2).toHavePrompt('Choose a character to honor');
                this.player2.clickPrompt('Back');
                expect(this.player2).toHavePrompt('Choose a character to:');
                this.player2.clickPrompt('Dishonor');
                this.player2.clickCard(this.borderRider);
                expect(this.borderRider.isDishonored).toBe(true);
                expect(this.whisperer.isHonored).toBe(true);
            });

            it('should skip the menu, without a Back button, when both targets are already dishonored', function() {
                this.borderRider.dishonor();
                this.whisperer.dishonor();
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickCard(this.borderRider);
                this.player2.clickCard(this.whisperer);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Choose a character to honor');
                expect(this.player2).not.toHavePromptButton('Back');
                this.player2.clickCard(this.whisperer);
                expect(this.whisperer.isDishonored).toBe(false);
                expect(this.borderRider.isDishonored).toBe(true);
            });

            it('should only offer characters that can receive the chosen status', function() {
                this.borderRider.honor();
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickCard(this.borderRider);
                this.player2.clickCard(this.whisperer);
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('Honor');
                expect(this.player2).toBeAbleToSelect(this.whisperer);
                expect(this.player2).not.toBeAbleToSelect(this.borderRider);
                this.player2.clickCard(this.whisperer);
                expect(this.whisperer.isHonored).toBe(true);
                expect(this.borderRider.isHonored).toBe(false);
            });
            it('should report which character is honored and which is dishonored', function() {
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickCard(this.borderRider);
                this.player2.clickCard(this.whisperer);
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('Dishonor');
                this.player2.clickCard(this.whisperer);
                expect(this.getChatLogs(5)).toContain('player2 chooses to honor Border Rider and dishonor Doji Whisperer');
            });
        });
    });
});
