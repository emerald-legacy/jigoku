describe('ability effect message', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ikoma-ikehata', 'doji-hotaru'],
                    conflictDeck: ['fine-katana', 'ornate-fan']
                },
                player2: {
                    inPlay: ['miya-mystic']
                }
            });
            this.ikehata = this.player1.findCardByName('ikoma-ikehata');
            this.hotaru = this.player1.findCardByName('doji-hotaru');
            this.mystic = this.player2.findCardByName('miya-mystic');
            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
            this.noMoreActions();
        });

        it('names every game action of the ability', function() {
            this.player1.clickRing('air');
            this.player1.clickRing('air');
            this.player1.clickCard(this.shamefulDisplay);
            this.player1.clickCard(this.ikehata);
            this.player1.clickPrompt('Initiate Conflict');
            this.player1.clickPrompt('No Target');
            this.player2.clickCard(this.mystic);
            this.player2.clickPrompt('Done');
            this.noMoreActions();
            this.player1.clickCard(this.ikehata);
            this.player1.clickCard(this.hotaru);
            expect(this.getChatLogs(5)).toContain('player1 uses Ikoma Ikehata to honor Doji Hotaru and draw 1 card');
        });
    });
});
