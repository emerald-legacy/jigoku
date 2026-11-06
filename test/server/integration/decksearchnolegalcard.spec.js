describe('Deck search that must take a card', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 5,
                    inPlay: ['alibi-artist'],
                    conflictDeck: ['fine-katana', 'ornate-fan', 'reprieve']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    hand: ['jealous-ancestor']
                }
            });

            this.alibi = this.player1.findCardByName('alibi-artist');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.jealousAncestor = this.player2.findCardByName('jealous-ancestor');

            this.player1.pass();
            this.player2.clickCard(this.jealousAncestor);
            this.player2.clickPrompt('Play Jealous Ancestor as an attachment');
            this.player2.clickCard(this.alibi);
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.alibi],
                defenders: [this.whisperer]
            });
            this.player2.pass();
        });

        it('ends when no card can be taken', function () {
            const handSize = this.player1.hand.length;
            this.player1.clickCard(this.alibi);
            expect(this.player1).not.toHavePrompt('Select a card');
            expect(this.player1.hand.length).toBe(handSize);
        });
    });
});
