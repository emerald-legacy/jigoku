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

        it('cannot choose an X-cost card, as X is 0 (EmeraldDB ruling on Kunshu)', function() {
            this.player1.fate = 0;
            this.player1.clickCard(this.toshimoko);
            expect(this.player1).not.toBeAbleToSelect(this.alliance);
        });
    });
});
