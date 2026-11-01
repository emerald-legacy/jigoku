describe('Togashi Mendicant', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-mendicant'],
                    dynastyDiscard: ['kanjo-district', 'shiba-tsukune', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['matsu-berserker']
                }
            });
            this.mendicant = this.player1.findCardByName('togashi-mendicant');
            this.kanjo = this.player1.findCardByName('kanjo-district');
            this.tsukune = this.player1.findCardByName('shiba-tsukune');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.player1.reduceDeckToNumber('dynasty deck', 0);
        });

        const reachFatePhase = function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
        };

        it('should put the top 3 cards back in the chosen order', function() {
            this.player1.moveCard(this.kanjo, 'dynasty deck');
            this.player1.moveCard(this.tsukune, 'dynasty deck');
            this.player1.moveCard(this.whisperer, 'dynasty deck');
            reachFatePhase.call(this);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.mendicant);
            expect(this.player1).toHavePrompt('Which card do you want to be on top?');
            expect(this.player1).toHavePromptButton('Kanjo District');
            expect(this.player1).toHavePromptButton('Shiba Tsukune');
            expect(this.player1).toHavePromptButton('Doji Whisperer');
            this.player1.clickPrompt('Kanjo District');
            expect(this.player1).toHavePrompt('Which card do you want to be the second card?');
            expect(this.player1).not.toHavePromptButton('Kanjo District');
            this.player1.clickPrompt('Doji Whisperer');
            expect(this.player1.player.dynastyDeck).toEqual([this.kanjo, this.whisperer, this.tsukune]);
        });

        it('should finish after one choice with 2 cards in the deck', function() {
            this.player1.moveCard(this.kanjo, 'dynasty deck');
            this.player1.moveCard(this.tsukune, 'dynasty deck');
            reachFatePhase.call(this);
            this.player1.clickCard(this.mendicant);
            expect(this.player1).toHavePrompt('Which card do you want to be on top?');
            this.player1.clickPrompt('Kanjo District');
            expect(this.player1).not.toHavePrompt('Which card do you want to be the second card?');
            expect(this.player1.player.dynastyDeck).toEqual([this.kanjo, this.tsukune]);
        });
    });
});
