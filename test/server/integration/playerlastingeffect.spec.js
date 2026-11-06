import { ResolvableAbility } from '../../../build/server/game/ResolvableAbility.js';
import { playerLastingEffect } from '../../../build/server/game/GameActions/GameActions.js';
import { cannotResolveRings } from '../../../build/server/game/effects.js';
import { EffectName, Players } from '../../../build/server/game/Constants.js';

describe('Player lasting effect targets', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.resolve = (action) => {
                const context = new ResolvableAbility(this.whisperer, {}).createContext(this.player1.player);
                this.game.queueSimpleStep(() => action.resolve(undefined, context));
                this.game.continue();
            };
            this.affected = () => [this.player1.player, this.player2.player].map((player) => player.anyEffect(EffectName.CannotResolveRings));
        });

        it('affects the ability\'s player by default', function () {
            this.resolve(playerLastingEffect({ effect: cannotResolveRings() }));
            expect(this.affected()).toEqual([true, false]);
        });

        it('affects the opponent with Players.Opponent', function () {
            this.resolve(playerLastingEffect({ target: Players.Opponent, effect: cannotResolveRings() }));
            expect(this.affected()).toEqual([false, true]);
        });

        it('affects both players with one effect for Players.Any', function () {
            const before = this.game.effectEngine.effects.length;
            this.resolve(playerLastingEffect({ target: Players.Any, effect: cannotResolveRings() }));
            expect(this.affected()).toEqual([true, true]);
            expect(this.game.effectEngine.effects.length).toBe(before + 1);
        });
    });
});
