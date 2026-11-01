describe('Favored Niece', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['favored-niece'],
                    hand: ['banzai', 'fine-katana', 'ornate-fan']
                }
            });
            this.niece = this.player1.findCardByName('favored-niece');
            this.banzai = this.player1.findCardByName('banzai');
            this.katana = this.player1.findCardByName('fine-katana');
            this.fan = this.player1.findCardByName('ornate-fan');
        });

        it('discards a card from your hand to draw a card', function() {
            const topCard = this.player1.conflictDeck[0];
            this.player1.clickCard(this.niece);
            expect(this.player1).toBeAbleToSelect(this.banzai);
            this.player1.clickCard(this.banzai);
            expect(this.banzai.location).toBe('conflict discard pile');
            expect(topCard.location).toBe('hand');
            expect(this.player1.hand.length).toBe(3);
        });

        it('can be used twice per round but not a third time', function() {
            this.player1.clickCard(this.niece);
            this.player1.clickCard(this.banzai);
            this.player2.pass();
            this.player1.clickCard(this.niece);
            this.player1.clickCard(this.katana);
            expect(this.katana.location).toBe('conflict discard pile');
            this.player2.pass();
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.niece);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player1).not.toBeAbleToSelect(this.fan);
            expect(this.fan.location).toBe('hand');
            expect(this.player1.hand.length).toBe(3);
        });
    });
});
