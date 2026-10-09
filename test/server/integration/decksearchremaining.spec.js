import { ThenAbility } from '../../../build/server/game/ThenAbility.js';
import { RemainingCards } from '../../../build/server/game/Constants.js';
import { deckSearch, moveCard } from '../../../build/server/game/GameActions/GameActions.js';

describe('a deck search\'s remaining cards', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer'],
                    conflictDiscard: ['let-go', 'fine-katana', 'banzai', 'ornate-fan', 'assassination']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            // 5 cards; the search looks at the top 4, so Let Go stays below them
            this.player1.reduceDeckToNumber('conflict deck', 0);
            this.letGo = this.player1.moveCard('let-go', 'conflict deck');
            this.katana = this.player1.moveCard('fine-katana', 'conflict deck');
            this.banzai = this.player1.moveCard('banzai', 'conflict deck');
            this.fan = this.player1.moveCard('ornate-fan', 'conflict deck');
            this.assassination = this.player1.moveCard('assassination', 'conflict deck');

            this.search = (remainingCards) => {
                const context = new ThenAbility(this.whisperer, {}).createContext(this.player1.player);
                const action = deckSearch({ cardsToLookAt: 4, gameAction: moveCard({ destination: 'hand' }), remainingCards });
                this.game.queueSimpleStep(() => action.resolve(this.player1.player, context));
                this.game.continue();
                this.player1.clickPrompt('Ornate Fan');
            };
        });

        it('discards them', function() {
            this.search(RemainingCards.Discard);

            expect(this.fan.location).toBe('hand');
            expect(this.assassination.location).toBe('conflict discard pile');
            expect(this.banzai.location).toBe('conflict discard pile');
            expect(this.katana.location).toBe('conflict discard pile');
            expect(this.player1.conflictDeck).toEqual([this.letGo]);
            expect(this.getChatLogs(3)).toContain('player1 discards Assassination, Banzai! and Fine Katana');
        });

        it('leaves them on top in the same order', function() {
            this.search(RemainingCards.Top);

            expect(this.fan.location).toBe('hand');
            expect(this.player1.conflictDeck).toEqual([this.assassination, this.banzai, this.katana, this.letGo]);
        });

        it('puts them on top in the order the player chooses', function() {
            this.search(RemainingCards.TopAnyOrder);

            expect(this.player1).toHavePrompt('Which card do you want to be on top?');
            expect(this.player1).not.toHavePromptButton('Let Go');
            this.player1.clickPrompt('Fine Katana');
            this.player1.clickPrompt('Banzai!');

            expect(this.fan.location).toBe('hand');
            expect(this.player1.conflictDeck).toEqual([this.katana, this.banzai, this.assassination, this.letGo]);
        });

        it('puts them on the bottom', function() {
            this.search(RemainingCards.BottomRandom);

            expect(this.fan.location).toBe('hand');
            expect(this.player1.conflictDeck[0]).toBe(this.letGo);
            expect(this.player1.conflictDeck.slice(1)).toEqual(jasmine.arrayWithExactContents([this.assassination, this.banzai, this.katana]));
        });
    });
});
