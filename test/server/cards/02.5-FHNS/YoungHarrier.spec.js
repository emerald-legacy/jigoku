describe('Young Harrier', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['young-harrier', 'doji-whisperer', { card: 'brash-samurai', honor: 'honored' }, 'matsu-berserker'],
                    hand: ['arbiter-of-authority']
                },
                player2: {
                    hand: ['way-of-the-scorpion', 'way-of-the-scorpion']
                }
            });
            this.harrier = this.player1.findCardByName('young-harrier');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.wots = this.player2.filterCardsByName('way-of-the-scorpion', 'hand');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.whisperer, this.brash, this.berserker],
                defenders: []
            });
        });

        // ruling #459: an honored Crane character cannot be dishonored either
        it('dishonors itself so your Crane characters cannot be dishonored this phase', function() {
            this.player2.pass();
            this.player1.clickCard(this.harrier);
            expect(this.harrier.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Young Harrier, dishonoring Young Harrier to prevent Crane characters from being dishonored this phase');
            this.player2.clickCard(this.wots[0]);
            expect(this.player2).toHavePrompt('Way of the Scorpion');
            expect(this.player2).toBeAbleToSelect(this.berserker);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);
            expect(this.player2).not.toBeAbleToSelect(this.brash);
            this.player2.clickCard(this.berserker);
            expect(this.berserker.isDishonored).toBe(true);
            expect(this.brash.isHonored).toBe(true);
        });

        // ruling #223: characters entering play after the ability resolved are not protected
        it('does not protect Crane characters that enter play afterwards', function() {
            this.player2.pass();
            this.player1.clickCard(this.harrier);
            this.player2.pass();
            this.arbiter = this.player1.playCharacterFromHand('arbiter-of-authority');
            this.player1.clickPrompt('Conflict');
            expect(this.arbiter.isParticipating()).toBe(true);
            this.player2.clickCard(this.wots[0]);
            expect(this.player2).toBeAbleToSelect(this.arbiter);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);
            this.player2.clickCard(this.arbiter);
            expect(this.arbiter.isDishonored).toBe(true);
        });

        it('lets Crane characters be dishonored when it was not used', function() {
            expect(this.harrier.isDishonored).toBe(false);
            this.player2.clickCard(this.wots[0]);
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.isDishonored).toBe(true);
        });

        it('cannot be used while it is already dishonored', function() {
            this.player2.pass();
            this.player1.clickCard(this.harrier);
            this.player2.pass();
            expect(this.harrier.isDishonored).toBe(true);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.harrier);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
