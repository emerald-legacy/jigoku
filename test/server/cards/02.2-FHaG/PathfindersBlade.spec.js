describe('Pathfinder\'s Blade', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'border-rider', attachments: ['pathfinder-s-blade'] }, 'doji-whisperer']
                },
                player2: {
                    inPlay: ['brash-samurai', 'kitsuki-investigator']
                }
            });

            this.rider = this.player1.findCardByName('border-rider');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.blade = this.player1.findCardByName('pathfinder-s-blade');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.investigator = this.player2.findCardByName('kitsuki-investigator');
            this.shamefulDisplay = this.player2.findCardByName(fillers.province, 'province 1');
        });

        describe('when attached character is attacking', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    province: this.shamefulDisplay,
                    attackers: [this.rider, this.whisperer],
                    defenders: [this.brash, this.investigator]
                });
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickCard(this.rider);
                this.player2.clickCard(this.whisperer);
                this.player2.clickPrompt('Done');
            });

            // ruling #278: all effects of the province's ability are cancelled, even with several targets
            it('should sacrifice itself to cancel the effects of the attacked province\'s ability', function() {
                expect(this.player1).toHavePrompt('Any interrupts to the effects of Shameful Display?');
                expect(this.player1).toBeAbleToSelect(this.blade);
                this.player1.clickCard(this.blade);
                expect(this.blade.location).toBe('conflict discard pile');
                expect(this.rider.isHonored).toBe(false);
                expect(this.rider.isDishonored).toBe(false);
                expect(this.whisperer.isHonored).toBe(false);
                expect(this.whisperer.isDishonored).toBe(false);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(5)).toContain('player1 uses Pathfinder\'s Blade, sacrificing Pathfinder\'s Blade to cancel the effects of Shameful Display\'s ability');
            });

            it('should let the effects resolve if not used', function() {
                this.player1.clickPrompt('Pass');
                expect(this.blade.location).toBe('play area');
                this.player2.clickPrompt('Dishonor');
                this.player2.clickCard(this.rider);
                expect(this.rider.isDishonored).toBe(true);
                expect(this.whisperer.isHonored).toBe(true);
            });
        });

        it('should not trigger when attached character is not attacking', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                province: this.shamefulDisplay,
                attackers: [this.whisperer],
                defenders: [this.brash]
            });
            this.player2.clickCard(this.shamefulDisplay);
            this.player2.clickCard(this.brash);
            this.player2.clickCard(this.whisperer);
            this.player2.clickPrompt('Done');
            expect(this.player1).not.toHavePrompt('Any interrupts to the effects of Shameful Display?');
            this.player2.clickPrompt('Dishonor');
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.isDishonored).toBe(true);
            expect(this.brash.isHonored).toBe(true);
            expect(this.blade.location).toBe('play area');
        });
    });
});
