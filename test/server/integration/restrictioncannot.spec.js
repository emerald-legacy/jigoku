import { ThenAbility } from '../../../build/server/game/ThenAbility.js';
import { bow, cardLastingEffect, honor } from '../../../build/server/game/GameActions/GameActions.js';
import { immunity } from '../../../build/server/game/effects.js';

describe('A restriction with cannot', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                },
                player2: {
                    inPlay: ['adept-of-the-waves']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.adept = this.player2.findCardByName('adept-of-the-waves');
            this.resolve = (action, target, player) => {
                const context = new ThenAbility(this.whisperer, {}).createContext(player);
                this.game.queueSimpleStep(() => action.resolve(target, context));
                this.game.continue();
            };
        });

        it('only forbids what it names', function () {
            this.resolve(cardLastingEffect({ effect: immunity({ cannot: 'bow' }) }), this.whisperer, this.player1.player);
            this.resolve(bow(), this.whisperer, this.player2.player);
            expect(this.whisperer.bowed).toBe(false);
            this.resolve(honor(), this.whisperer, this.player2.player);
            expect(this.whisperer.isHonored).toBe(true);
        });
    });
});
