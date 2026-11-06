describe('Harmonize', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider', 'doji-whisperer'],
                    hand: ['harmonize']
                },
                player2: {
                    inPlay: ['brash-samurai', 'kitsuki-investigator', 'ikoma-prodigy'],
                    hand: ['harmonize']
                }
            });

            this.rider = this.player1.findCardByName('border-rider');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.harmonize = this.player1.findCardByName('harmonize');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.investigator = this.player2.findCardByName('kitsuki-investigator');
            this.prodigy = this.player2.findCardByName('ikoma-prodigy');
            this.harmonize2 = this.player2.findCardByName('harmonize');

            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash, this.investigator, this.prodigy],
                defenders: [this.rider, this.whisperer]
            });
        });

        it('should send home a defender and an attacker with equal or lower printed cost', function() {
            this.player1.clickCard(this.harmonize);
            expect(this.player1).toHavePrompt('Harmonize');
            expect(this.player1).toBeAbleToSelect(this.rider);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            this.player1.clickCard(this.rider);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).toBeAbleToSelect(this.prodigy);
            expect(this.player1).not.toBeAbleToSelect(this.investigator);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.brash);
            expect(this.rider.isParticipating()).toBe(false);
            expect(this.brash.isParticipating()).toBe(false);
            expect(this.whisperer.isParticipating()).toBe(true);
            expect(this.investigator.isParticipating()).toBe(true);
            expect(this.prodigy.isParticipating()).toBe(true);
            expect(this.harmonize.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 plays Harmonize to send home Border Rider and Brash Samurai');
        });

        it('should compare against the cost of the chosen defender', function() {
            this.player1.clickCard(this.harmonize);
            this.player1.clickCard(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.prodigy);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.investigator);
            this.player1.clickCard(this.prodigy);
            expect(this.whisperer.isParticipating()).toBe(false);
            expect(this.prodigy.isParticipating()).toBe(false);
        });

        it('should not be playable by the attacking player', function() {
            this.player1.pass();
            this.player2.clickCard(this.harmonize2);
            expect(this.harmonize2.location).toBe('hand');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.brash.isParticipating()).toBe(true);
        });
    });
});
