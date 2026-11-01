import { removeFromGameInsteadOfLeavingPlay } from '../../../build/server/game/effects.js';
import { msg } from '../../../build/server/game/GameChat.js';

describe('Remove from the game instead of leaving play', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.whisperer.declareAbilities(() => {
                this.whisperer.action('Test')
                    .cardLastingEffect({
                        effect: removeFromGameInsteadOfLeavingPlay({ message: (card) => msg`${card} vanishes` })
                    })
                    .afterwards()
                    .sacrifice();
            });
            this.destinations = [];
            this.game.on('onCardLeavesPlay', (event) => this.destinations.push(event.destination));
        });

        it('sends the card to the removed-from-game pile when it leaves play', function() {
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.location).toBe('removed from game');
            expect(this.destinations).toEqual(['removed from game']);
            expect(this.getChatLogs(3)).toContain('Doji Whisperer vanishes');
        });
    });
});
