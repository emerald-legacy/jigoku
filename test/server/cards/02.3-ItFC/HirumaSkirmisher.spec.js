import { ResolvableAbility } from '../../../../build/server/game/ResolvableAbility.js';
import { putIntoPlay } from '../../../../build/server/game/GameActions/GameActions.js';

describe('Hiruma Skirmisher', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['hiruma-skirmisher', 'hiruma-skirmisher']
                }
            });
            [this.skirmisher, this.skirmisher2] = this.player1.filterCardsByName('hiruma-skirmisher');
        });

        it('gains covert after you play it', function () {
            this.player1.clickCard(this.skirmisher);
            this.player1.clickPrompt('0');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.skirmisher);
        });

        it('does not react when put into play', function () {
            const context = new ResolvableAbility(this.skirmisher, {}).createContext(this.player1.player);
            this.game.queueSimpleStep(() => putIntoPlay().resolve(this.skirmisher2, context));
            this.game.continue();
            expect(this.skirmisher2.location).toBe('play area');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
