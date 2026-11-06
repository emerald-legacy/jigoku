describe('Each player discarding chosen cards', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['oracle-of-stone']
                },
                player2: {
                    hand: ['fine-katana', 'ornate-fan', 'banzai']
                }
            });
            this.oracle = this.player1.findCardByName('oracle-of-stone');
        });

        it('still asks the other players when the first one has to discard their whole hand', function () {
            // player1 holds only the 2 drawn cards and discards both; player2 holds 5 and chooses 2
            this.player1.clickCard(this.oracle);
            expect(this.player2).toHavePrompt('Choose 2 cards to discard');
            expect(this.player2.hand.length).toBe(5);
            this.player2.clickCard('fine-katana');
            this.player2.clickCard('ornate-fan');
            this.player2.clickPrompt('Done');
            expect(this.player1.hand.length).toBe(0);
            expect(this.player2.hand.length).toBe(3);
        });
    });
});
