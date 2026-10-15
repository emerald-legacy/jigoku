describe('playing a card without paying its fate cost', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-toshimoko'],
                    hand: ['kunshu'],
                    conflictDeck: ['a-new-name', 'a-new-name', 'a-new-name']
                },
                player2: {
                    inPlay: ['bayushi-kachiko'],
                    conflictDiscard: ['favorable-alliance']
                }
            });
            this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
            this.kachiko = this.player2.findCardByName('bayushi-kachiko');
            this.kunshu = this.player1.findCardByName('kunshu');
            this.alliance = this.player2.findCardByName('favorable-alliance');

            this.player1.player.imperialFavor = 'political';
            this.player1.playAttachment(this.kunshu, this.toshimoko);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                defenders: [this.kachiko]
            });
            this.player2.pass();
        });

        it('can choose an X-cost card with no fate in the pool', function() {
            this.player1.fate = 0;
            const deckSize = this.player1.conflictDeck.length;
            this.player1.clickCard(this.toshimoko);
            expect(this.player1).toBeAbleToSelect(this.alliance);
            this.player1.clickCard(this.alliance);
            this.player1.clickPrompt('3');
            expect(this.player1.fate).toBe(0);
            expect(this.player1.conflictDeck.length).toBe(deckSize - 3);
        });
    });
});
