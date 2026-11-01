describe('Night Raid', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['valiant-oathkeeper', 'samurai-of-integrity'],
                    hand: ['fine-katana', 'ornate-fan', 'banzai', 'charge']
                },
                player2: {
                    provinces: ['night-raid'],
                    inPlay: ['doji-whisperer']
                }
            });
            this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
            this.samurai = this.player1.findCardByName('samurai-of-integrity');
            this.katana = this.player1.findCardByName('fine-katana');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.banzai = this.player1.findCardByName('banzai');
            this.charge = this.player1.findCardByName('charge');
            this.nightRaid = this.player2.findCardByName('night-raid', 'province 1');
            this.noMoreActions();
        });

        it('after it is revealed, makes the opponent choose and discard one card per attacking character', function() {
            this.initiateConflict({
                type: 'military',
                province: this.nightRaid,
                attackers: [this.oathkeeper, this.samurai]
            });
            expect(this.nightRaid.isFacedown()).toBe(false);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.nightRaid);
            this.player2.clickCard(this.nightRaid);
            expect(this.player1).toHavePrompt('Choose 2 cards to discard');
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.charge);
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.banzai);
            this.player1.clickPrompt('Done');
            expect(this.katana.location).toBe('conflict discard pile');
            expect(this.banzai.location).toBe('conflict discard pile');
            expect(this.fan.location).toBe('hand');
            expect(this.charge.location).toBe('hand');
            expect(this.player1.hand.length).toBe(2);
        });

        it('makes the opponent discard only one card with one attacking character', function() {
            this.initiateConflict({
                type: 'military',
                province: this.nightRaid,
                attackers: [this.oathkeeper]
            });
            this.player2.clickCard(this.nightRaid);
            expect(this.player1).toHavePrompt('Choose a card to discard');
            this.player1.clickCard(this.fan);
            expect(this.fan.location).toBe('conflict discard pile');
            expect(this.player1.hand.length).toBe(3);
        });
    });
});
