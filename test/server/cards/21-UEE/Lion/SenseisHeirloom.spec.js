describe('Sensei\'s Heirloom', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kitsu-motso'],
                    hand: ['sensei-s-heirloom']
                },
                player2: {
                    inPlay: [],
                    hand: []
                }
            });

            this.motso = this.player1.findCardByName('kitsu-motso');
            this.senseiHeirloom = this.player1.findCardByName('sensei-s-heirloom');
        });

        it('gets a card to hand', function () {
            this.player1.clickCard(this.senseiHeirloom);
            this.player1.clickCard(this.motso);
            expect(this.player1).toHavePrompt('Any reactions to Sensei\'s Heirloom being played?');

            this.player1.clickCard(this.senseiHeirloom);
            expect(this.player1).toHavePrompt('Select a card');
            expect(this.player1).toHavePromptButton('Supernatural Storm (4)');

            this.player1.clickPrompt('Supernatural Storm (4)');
            expect(this.getChatLogs(5)).toContain('player1 takes 1 card');
        });
    });
});
