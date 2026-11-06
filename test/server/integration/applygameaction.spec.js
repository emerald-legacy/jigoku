describe('a framework game action with an "unless" cost', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'doji-challenger'],
                    hand: ['softskin'],
                    conflictDeck: ['fine-katana', 'ornate-fan', 'banzai', 'assassination']
                },
                player2: {}
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.softskin = this.player1.findCardByName('softskin');

            this.player1.playAttachment(this.softskin, this.whisperer);
            this.whisperer.bowed = true;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'water',
                attackers: [this.challenger],
                defenders: []
            });
            this.noMoreActions();
            // the province broke: keep the card in it
            this.player1.clickPrompt('No');
        });

        it('readies the character once the cost is paid (Water ring and Softskin)', function() {
            const deck = this.player1.conflictDeck.length;
            this.player1.clickCard(this.whisperer);

            expect(this.player1.conflictDeck.length).toBe(deck - 3);
            expect(this.whisperer.bowed).toBe(false);
        });
    });
});
