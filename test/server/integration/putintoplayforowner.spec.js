describe('A card put into play for its owner by the opponent', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker'],
                    conflictDiscard: ['bayushi-traitor']
                },
                player2: {
                    honor: 10,
                    fate: 6,
                    hand: ['infiltrator']
                }
            });
            this.player1.player.showBid = 1;
            this.player2.player.showBid = 5;
            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.traitor = this.player1.findCardByName('bayushi-traitor');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.matsuBerserker],
                defenders: []
            });
            this.infiltrator = this.player2.playAttachment('infiltrator', this.matsuBerserker);
            this.player1.pass();
            this.player1.player.moveCard(this.traitor, 'conflict deck');
        });

        it('is listed only under its controller, next to their other cards', function() {
            this.player2.clickCard(this.infiltrator);
            this.player2.clickPrompt('Play this card');
            this.player2.clickPrompt('0');
            expect(this.traitor.location).toBe('play area');
            expect(this.traitor.controller).toBe(this.player1.player);
            expect(this.player1.player.cardsInPlay).toEqual([this.matsuBerserker, this.traitor]);
            expect(this.player2.player.cardsInPlay).not.toContain(this.traitor);
        });
    });
});
