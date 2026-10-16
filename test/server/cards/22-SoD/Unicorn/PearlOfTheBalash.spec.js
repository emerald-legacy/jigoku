describe('Pearl of the Balash', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves', 'doji-whisperer'],
                    hand: ['pearl-of-the-balash']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.pearl = this.player1.findCardByName('pearl-of-the-balash');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
        });

        it('should only attach to a Shugenja character', function() {
            this.player1.clickCard(this.pearl);
            expect(this.player1).toBeAbleToSelect(this.adept);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
        });

        it('should give the attached character covert', function() {
            this.player1.playAttachment(this.pearl, this.adept);
            expect(this.adept.hasKeyword('covert')).toBe(true);
            this.noMoreActions();
            this.player1.clickRing('air');
            this.player1.clickCard(this.shamefulDisplay);
            this.player1.clickCard(this.adept);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player1).toHavePrompt('Choose covert target for Adept of the Waves');
            this.player1.clickCard(this.challenger);
            expect(this.challenger.covert).toBe(true);
        });
    });
});
